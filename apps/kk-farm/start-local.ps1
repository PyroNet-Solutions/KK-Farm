# Starts KK Farm on this laptop only. Serves http://127.0.0.1:8000 and keeps PostgreSQL on 127.0.0.1:5442.
# Nothing is exposed publicly. Run from any folder:
#   powershell -ExecutionPolicy Bypass -File "C:\Users\AMMAR\Desktop\KK Farm\apps\kk-farm\start-local.ps1"
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

try {
    $up = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/up' -UseBasicParsing -TimeoutSec 3
    if ($up.StatusCode -eq 200) {
        Write-Host 'KK Farm is already running at http://127.0.0.1:8000'
        exit 0
    }
} catch {
    # Not running yet, so carry on and start it.
}

$running = docker ps --filter 'name=^kkfarm_local_db$' --format '{{.Names}}'
if (-not $running) {
    Write-Host 'Starting the KK Farm database container...'
    docker start kkfarm_local_db | Out-Null
    Start-Sleep -Seconds 3
}

if (-not (Test-Path 'public/build/manifest.json')) {
    Write-Host 'Building the interface...'
    npm run build
}

Write-Host 'KK Farm is starting at http://127.0.0.1:8000 (press Ctrl+C to stop)'
php artisan serve --host=127.0.0.1 --port=8000
