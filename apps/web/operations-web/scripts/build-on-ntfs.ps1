param(
  [string]$TempRoot = "$env:LOCALAPPDATA\Temp\odirico-operations-web-build"
)

$appRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$workspaceRoot = Resolve-Path (Join-Path $appRoot "..\..\..")
$sourceApp = $appRoot.Path
$sourceCore = Join-Path $workspaceRoot "packages\core"
$sourceAuth = Join-Path $workspaceRoot "packages\auth"
$sourceApi = Join-Path $workspaceRoot "packages\api"
$buildRoot = $TempRoot
$appTarget = Join-Path $buildRoot "apps\web\operations-web"
$coreTarget = Join-Path $buildRoot "packages\core"
$authTarget = Join-Path $buildRoot "packages\auth"
$apiTarget = Join-Path $buildRoot "packages\api"

function Ensure-CleanDirectory {
  param([string]$Path)

  if (Test-Path -LiteralPath $Path) {
    Remove-Item -LiteralPath $Path -Recurse -Force
  }

  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Copy-Tree {
  param(
    [string]$Source,
    [string]$Destination
  )

  $excludeDirs = @("node_modules", ".next", ".git")

  Ensure-CleanDirectory -Path $Destination

  $robocopyArgs = @(
    $Source,
    $Destination,
    "/E",
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/NC",
    "/NS",
    "/XD"
  ) + $excludeDirs

  & robocopy @robocopyArgs | Out-Null
  $exitCode = $LASTEXITCODE

  if ($exitCode -ge 8) {
    throw "Robocopy failed for $Source -> $Destination with exit code $exitCode"
  }
}

function Install-Package {
  param([string]$PackagePath)

  Push-Location $PackagePath
  try {
    npm install --workspaces=false --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
      throw "npm install failed in $PackagePath with exit code $LASTEXITCODE"
    }
  }
  finally {
    Pop-Location
  }
}

Ensure-CleanDirectory -Path $buildRoot
New-Item -ItemType Directory -Force -Path (Join-Path $buildRoot "apps\web"), (Join-Path $buildRoot "packages") | Out-Null

Copy-Tree -Source $sourceApp -Destination $appTarget
Copy-Tree -Source $sourceCore -Destination $coreTarget
Copy-Tree -Source $sourceAuth -Destination $authTarget
Copy-Tree -Source $sourceApi -Destination $apiTarget

Install-Package -PackagePath $coreTarget
Install-Package -PackagePath $authTarget
Install-Package -PackagePath $apiTarget
Install-Package -PackagePath $appTarget

Push-Location $appTarget
try {
  $env:ODIRICO_BUILD_DIRECT = "1"
  npm run build
  if ($LASTEXITCODE -ne 0) {
    throw "npm run build failed with exit code $LASTEXITCODE"
  }
}
finally {
  Remove-Item Env:ODIRICO_BUILD_DIRECT -ErrorAction SilentlyContinue
  Pop-Location
}

Write-Output "Build completed in $appTarget"
