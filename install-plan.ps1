param(
  [Parameter(Mandatory=$true)][string]$RepoPath
)
$ErrorActionPreference = 'Stop'
$source = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = (Resolve-Path $RepoPath).Path
$preserve = @('.git','node_modules','src','public','dist','build','.next','coverage','.env','.env.local','package.json','bun.lockb','bun.lock','pnpm-lock.yaml','package-lock.json','yarn.lock')
$backup = Join-Path $target ('.plan-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Force -Path $backup | Out-Null

function Copy-PlanItem($srcPath, $relativePath) {
  $name = Split-Path -Leaf $relativePath
  if ($relativePath -in $preserve) {
    Write-Host "Preserving existing $relativePath"
    return
  }
  $destPath = Join-Path $target $relativePath
  if ((Get-Item -LiteralPath $srcPath).PSIsContainer) {
    New-Item -ItemType Directory -Force -Path $destPath | Out-Null
    Get-ChildItem -LiteralPath $srcPath -Force | ForEach-Object {
      $childRelative = if ($relativePath) { Join-Path $relativePath $_.Name } else { $_.Name }
      Copy-PlanItem $_.FullName $childRelative
    }
    return
  }
  $destParent = Split-Path -Parent $destPath
  New-Item -ItemType Directory -Force -Path $destParent | Out-Null
  if (Test-Path -LiteralPath $destPath) {
    $backupPath = Join-Path $backup $relativePath
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupPath) | Out-Null
    Move-Item -LiteralPath $destPath -Destination $backupPath -Force
    Write-Host "Backed up collision: $relativePath"
  }
  Copy-Item -LiteralPath $srcPath -Destination $destPath -Force
}

Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
  if ($_.Name -in @('install-plan.ps1','GITHUB_PUSH.md')) { return }
  Copy-PlanItem $_.FullName $_.Name
}
Write-Host "Plan files safely merged into $target"
Write-Host "Existing source code, public assets, package manifests, lockfiles, and .git were preserved."
Write-Host "Conflicting files were backed up under $backup"
Write-Host "Review changes, then run: node scripts/validate-plan.mjs"
