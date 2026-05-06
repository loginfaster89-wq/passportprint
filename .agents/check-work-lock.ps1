$ErrorActionPreference = 'Stop'

$lockPath = Join-Path $PSScriptRoot 'work-locks.md'

if (-not (Test-Path -LiteralPath $lockPath)) {
  Write-Error "Missing work lock file: $lockPath"
  exit 3
}

$content = Get-Content -LiteralPath $lockPath -Raw
$isActive = $content -match '\*\*Status:\*\*\s+ACTIVE'

if ($isActive) {
  $scope = [regex]::Match($content, '\*\*Scope:\*\*\s*(.+)').Groups[1].Value.Trim()
  $owner = [regex]::Match($content, '\*\*Owner:\*\*\s*(.+)').Groups[1].Value.Trim()
  $hardStop = $scope -match '(?i)\b(deploy|deployment|live|production release|cloudflare)\b'

  if ($hardStop) {
    Write-Host "ACTIVE live/deploy lock found for $owner. Stop before editing, pushing, or deploying unless the owner releases it." -ForegroundColor Yellow
    Write-Host "Scope: $scope" -ForegroundColor Yellow
    exit 2
  }

  Write-Host "ACTIVE scoped work lock found for $owner." -ForegroundColor Yellow
  Write-Host "Scope: $scope" -ForegroundColor Yellow
  Write-Host 'This is not an automatic full stop. Continue only if your owned files are disjoint, do not touch the locked scope, and stage/commit only your owned files.' -ForegroundColor Yellow
  Write-Host 'Stop and ask the user if your task overlaps the active scope, shared cache/app-shell files, .agents coordination files, or any live deploy/release work.' -ForegroundColor Yellow
  exit 0
}

Write-Host 'No active work lock. You may continue after declaring owned scope.' -ForegroundColor Green
exit 0
