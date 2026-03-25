$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot "backend"

Write-Host "Starting Flask backend from $backendDir" -ForegroundColor Cyan
Set-Location $backendDir

python -m flask --app wsgi:app run --host 127.0.0.1 --port 5000 --no-debugger --no-reload