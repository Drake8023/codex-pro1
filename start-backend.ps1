param(
  [switch]$UseLocalDb,
  [string]$RemoteHost = "8.141.98.20",
  [string]$RemoteSshUser = "root",
  [string]$RemoteSshPassword = "Heyjesonyo8023",
  [int]$LocalDbPort = 15432,
  [int]$RemoteDbPort = 5432,
  [string]$RemoteDbUser = "codex",
  [string]$RemoteDbPassword = "80238023",
  [string]$RemoteDbName = "codex_pro1"
)

$ErrorActionPreference = "Stop"

function Test-LocalTcpPort {
  param([int]$Port)

  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $async = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $connected = $async.AsyncWaitHandle.WaitOne(500)
    if (-not $connected) {
      $client.Close()
      return $false
    }
    $client.EndConnect($async)
    $client.Close()
    return $true
  } catch {
    return $false
  }
}

function Pause-BeforeExit {
  param([string]$Message = "Press Enter to close this window")
  if ($Host.Name -eq "ConsoleHost") {
    Read-Host $Message | Out-Null
  }
}

try {
  $repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
  $backendDir = Join-Path $repoRoot "backend"
  $tunnelScript = Join-Path $repoRoot "scripts\db_tunnel.py"
  $tunnelReadyFile = Join-Path $repoRoot ".db-tunnel-ready"

  if ($UseLocalDb) {
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:REMOTE_UPLOAD_BASE_URL -ErrorAction SilentlyContinue
    Write-Host "Starting Flask backend with local SQLite database" -ForegroundColor Cyan
  } else {
    $env:DATABASE_URL = "postgresql+psycopg://$($RemoteDbUser):$($RemoteDbPassword)@127.0.0.1:$($LocalDbPort)/$($RemoteDbName)"
    $env:REMOTE_UPLOAD_BASE_URL = "http://$($RemoteHost):5173/api/uploads"

    if (-not (Test-Path $tunnelScript)) {
      throw "Database tunnel helper not found: $tunnelScript"
    }

    if (-not (Test-LocalTcpPort -Port $LocalDbPort)) {
      if (Test-Path $tunnelReadyFile) {
        Remove-Item $tunnelReadyFile -Force -ErrorAction SilentlyContinue
      }

      $tunnelArgs = @(
        $tunnelScript,
        "--ssh-host", $RemoteHost,
        "--ssh-user", $RemoteSshUser,
        "--ssh-password", $RemoteSshPassword,
        "--local-port", $LocalDbPort,
        "--remote-port", $RemoteDbPort,
        "--ready-file", $tunnelReadyFile
      )
      Start-Process python -ArgumentList $tunnelArgs -WindowStyle Hidden | Out-Null
      Write-Host "Starting automatic SSH tunnel to the server database..." -ForegroundColor Yellow

      $ready = $false
      for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1
        if (Test-LocalTcpPort -Port $LocalDbPort) {
          $ready = $true
          break
        }
      }

      if (-not $ready) {
        throw "Automatic SSH tunnel to 127.0.0.1:$LocalDbPort was not ready within 60 seconds."
      }
    }

    Write-Host "Starting Flask backend with server Postgres via automatic SSH tunnel on 127.0.0.1:$LocalDbPort" -ForegroundColor Cyan
  }

  Set-Location $backendDir
  python -m flask --app wsgi:app run --host 127.0.0.1 --port 5000 --no-debugger --no-reload
} catch {
  Write-Host ""
  Write-Host "Backend start failed:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Pause-BeforeExit
  exit 1
}
