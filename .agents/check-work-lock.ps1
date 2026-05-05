$ErrorActionPreference = 'Stop'

$lockPath = Join-Path $PSScriptRoot 'work-locks.md'

if (-not (Test-Path -LiteralPath $lockPath)) {
  Write-Error "Missing work lock file: $lockPath"
  exit 3
}

$content = Get-Content -LiteralPath $lockPath -Raw
$isActive = $content -match '\*\*Status:\*\*\s+ACTIVE'

if ($isActive) {
  Write-Host 'ACTIVE work lock found in .agents/work-locks.md. Stop before editing, pushing, or deploying.' -ForegroundColor Yellow
  exit 2
}

Write-Host 'No active global work lock. You may continue after declaring owned scope.' -ForegroundColor Green
exit 0
