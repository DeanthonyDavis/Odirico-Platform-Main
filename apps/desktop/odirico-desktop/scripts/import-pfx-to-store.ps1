param(
  [Parameter(Mandatory = $true)]
  [string]$CertificatePath,
  [Parameter(Mandatory = $true)]
  [string]$Password,
  [Parameter(Mandatory = $true)]
  [string]$StorePath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$resolvedCertificatePath = (Resolve-Path -LiteralPath $CertificatePath).Path
$securePassword = ConvertTo-SecureString -String $Password -Force -AsPlainText
$imported = Import-PfxCertificate -FilePath $resolvedCertificatePath -CertStoreLocation $StorePath -Password $securePassword

if (-not $imported) {
  throw "Import-PfxCertificate did not return a certificate object."
}

$thumbprint = $imported |
  Select-Object -ExpandProperty Thumbprint -First 1

if ([string]::IsNullOrWhiteSpace($thumbprint)) {
  throw "The imported certificate thumbprint could not be determined."
}

Write-Output $thumbprint
