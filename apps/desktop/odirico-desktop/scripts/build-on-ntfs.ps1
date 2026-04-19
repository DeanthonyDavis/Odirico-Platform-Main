param(
  [string]$TempRoot = "$env:LOCALAPPDATA\Temp\odirico-desktop-build"
)

$appRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$workspaceRoot = Resolve-Path (Join-Path $appRoot "..\..\..")
$sourceApp = $appRoot.Path
$sourceCore = Join-Path $workspaceRoot "packages\core"
$sourceDesignTokens = Join-Path $workspaceRoot "packages\design-tokens"
$buildRoot = $TempRoot
$appTarget = Join-Path $buildRoot "apps\desktop\odirico-desktop"
$coreTarget = Join-Path $buildRoot "packages\core"
$designTokensTarget = Join-Path $buildRoot "packages\design-tokens"
$sourceDist = Join-Path $sourceApp "dist"
$builtDist = Join-Path $appTarget "dist"

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

  $excludeDirs = @("node_modules", "dist", ".git", "src-tauri\target")

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

function Install-App {
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
New-Item -ItemType Directory -Force -Path (Join-Path $buildRoot "apps\desktop"), (Join-Path $buildRoot "packages") | Out-Null
Copy-Tree -Source $sourceApp -Destination $appTarget
Copy-Tree -Source $sourceCore -Destination $coreTarget
Copy-Tree -Source $sourceDesignTokens -Destination $designTokensTarget
Install-App -PackagePath $appTarget

Push-Location $appTarget
try {
  $env:ODIRICO_BUILD_DIRECT = "1"
  & node ".\node_modules\typescript\bin\tsc"
  if ($LASTEXITCODE -ne 0) {
    throw "TypeScript build failed with exit code $LASTEXITCODE"
  }

  & node ".\node_modules\vite\bin\vite.js" "build"
  if ($LASTEXITCODE -ne 0) {
    throw "Vite build failed with exit code $LASTEXITCODE"
  }
}
finally {
  Remove-Item Env:ODIRICO_BUILD_DIRECT -ErrorAction SilentlyContinue
  Pop-Location
}

Ensure-CleanDirectory -Path $sourceDist

$robocopyDistArgs = @(
  $builtDist,
  $sourceDist,
  "/E",
  "/NFL",
  "/NDL",
  "/NJH",
  "/NJS",
  "/NC",
  "/NS"
)

& robocopy @robocopyDistArgs | Out-Null
$distExitCode = $LASTEXITCODE

if ($distExitCode -ge 8) {
  throw "Robocopy failed for built dist with exit code $distExitCode"
}

Write-Output "Build completed in $appTarget and copied back to $sourceDist"
