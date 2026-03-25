$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "frontend"

Write-Host "Starting Vite frontend from $frontendDir" -ForegroundColor Cyan
Set-Location $frontendDir

npm run dev -- --host 127.0.0.1