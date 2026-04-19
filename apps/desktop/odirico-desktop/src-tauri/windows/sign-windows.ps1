param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$FilePath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-RequiredPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PathValue,
    [Parameter(Mandatory = $true)]
    [string]$Label
  )

  try {
    return (Resolve-Path -LiteralPath $PathValue).Path
  }
  catch {
    throw "$Label was not found at '$PathValue'."
  }
}

function Require-Env {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$HelpText
  )

  $value = [Environment]::GetEnvironmentVariable($Name)

  if ([string]::IsNullOrWhiteSpace($value)) {
    throw "$Name is required. $HelpText"
  }

  return $value
}

function Get-SignToolPath {
  if (-not [string]::IsNullOrWhiteSpace($env:ODIRICO_WINDOWS_SIGNTOOL_PATH)) {
    return (Resolve-RequiredPath -PathValue $env:ODIRICO_WINDOWS_SIGNTOOL_PATH -Label "ODIRICO_WINDOWS_SIGNTOOL_PATH")
  }

  $command = Get-Command signtool.exe -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidatePatterns = @(
    "$env:ProgramFiles(x86)\Windows Kits\10\bin\*\x64\signtool.exe",
    "$env:ProgramFiles\Windows Kits\10\bin\*\x64\signtool.exe"
  )

  foreach ($pattern in $candidatePatterns) {
    $candidate = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue |
      Sort-Object FullName -Descending |
      Select-Object -First 1

    if ($candidate) {
      return $candidate.FullName
    }
  }

  throw "signtool.exe was not found. Install the Windows SDK or set ODIRICO_WINDOWS_SIGNTOOL_PATH."
}

function Invoke-SignTool {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $signToolPath = Get-SignToolPath
  & $signToolPath @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "signtool.exe failed with exit code $LASTEXITCODE."
  }
}

$resolvedFile = Resolve-RequiredPath -PathValue $FilePath -Label "Signing target"
$allowUnsigned = $env:ODIRICO_WINDOWS_ALLOW_UNSIGNED -eq "1"
$signingMode = [Environment]::GetEnvironmentVariable("ODIRICO_WINDOWS_SIGNING_MODE")

if ([string]::IsNullOrWhiteSpace($signingMode)) {
  if ($allowUnsigned) {
    Write-Warning "Skipping signing for '$resolvedFile' because ODIRICO_WINDOWS_ALLOW_UNSIGNED=1."
    exit 0
  }

  throw "ODIRICO_WINDOWS_SIGNING_MODE is required unless ODIRICO_WINDOWS_ALLOW_UNSIGNED=1."
}

switch ($signingMode) {
  "signtool-pfx" {
    $certificatePath = Resolve-RequiredPath -PathValue (Require-Env -Name "ODIRICO_WINDOWS_CERTIFICATE_PATH" -HelpText "Provide a .pfx code-signing certificate path.") -Label "ODIRICO_WINDOWS_CERTIFICATE_PATH"
    $certificatePassword = Require-Env -Name "ODIRICO_WINDOWS_CERTIFICATE_PASSWORD" -HelpText "Provide the password used to unlock your .pfx certificate."
    $timestampUrl = Require-Env -Name "ODIRICO_WINDOWS_TIMESTAMP_URL" -HelpText "Provide the timestamp server URL required by your certificate authority."

    Invoke-SignTool -Arguments @(
      "sign",
      "/f",
      $certificatePath,
      "/p",
      $certificatePassword,
      "/fd",
      "sha256",
      "/tr",
      $timestampUrl,
      "/td",
      "sha256",
      $resolvedFile
    )
    break
  }
  "signtool-store" {
    $thumbprint = Require-Env -Name "ODIRICO_WINDOWS_CERTIFICATE_THUMBPRINT" -HelpText "Provide the SHA-1 certificate thumbprint already imported into the Windows certificate store."
    $timestampUrl = Require-Env -Name "ODIRICO_WINDOWS_TIMESTAMP_URL" -HelpText "Provide the timestamp server URL required by your certificate authority."
    $storeName = if ([string]::IsNullOrWhiteSpace($env:ODIRICO_WINDOWS_CERTIFICATE_STORE)) { "My" } else { $env:ODIRICO_WINDOWS_CERTIFICATE_STORE }
    $storeLocation = if ([string]::IsNullOrWhiteSpace($env:ODIRICO_WINDOWS_CERTIFICATE_STORE_LOCATION)) { "CurrentUser" } else { $env:ODIRICO_WINDOWS_CERTIFICATE_STORE_LOCATION }

    $arguments = @(
      "sign",
      "/sha1",
      $thumbprint,
      "/s",
      $storeName,
      "/fd",
      "sha256",
      "/tr",
      $timestampUrl,
      "/td",
      "sha256"
    )

    if ($storeLocation -eq "LocalMachine") {
      $arguments += "/sm"
    }
    elseif ($storeLocation -ne "CurrentUser") {
      throw "ODIRICO_WINDOWS_CERTIFICATE_STORE_LOCATION must be CurrentUser or LocalMachine."
    }

    $arguments += $resolvedFile
    Invoke-SignTool -Arguments $arguments
    break
  }
  "trusted-signing-cli" {
    $trustedSigningCli = if ([string]::IsNullOrWhiteSpace($env:ODIRICO_WINDOWS_TRUSTED_SIGNING_CLI_PATH)) {
      "trusted-signing-cli"
    }
    else {
      $env:ODIRICO_WINDOWS_TRUSTED_SIGNING_CLI_PATH
    }

    $endpoint = Require-Env -Name "ODIRICO_WINDOWS_TRUSTED_SIGNING_ENDPOINT" -HelpText "Provide your Azure Trusted Signing endpoint."
    $account = Require-Env -Name "ODIRICO_WINDOWS_TRUSTED_SIGNING_ACCOUNT" -HelpText "Provide your Azure Trusted Signing account."
    $profile = Require-Env -Name "ODIRICO_WINDOWS_TRUSTED_SIGNING_PROFILE" -HelpText "Provide your Azure Trusted Signing profile."
    $description = if ([string]::IsNullOrWhiteSpace($env:ODIRICO_WINDOWS_SIGNING_DESCRIPTION)) { "Odirico Desktop" } else { $env:ODIRICO_WINDOWS_SIGNING_DESCRIPTION }

    & $trustedSigningCli sign -e $endpoint -a $account -c $profile -d $description $resolvedFile

    if ($LASTEXITCODE -ne 0) {
      throw "trusted-signing-cli failed with exit code $LASTEXITCODE."
    }
    break
  }
  default {
    throw "Unsupported ODIRICO_WINDOWS_SIGNING_MODE '$signingMode'. Expected signtool-pfx, signtool-store, or trusted-signing-cli."
  }
}
