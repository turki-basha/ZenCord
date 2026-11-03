# ZenCord Automated Windows PowerShell Installer
# Usage: iwr -useb https://raw.githubusercontent.com/turki-basha/ZenCord/main/scripts/install.ps1 | iex

$ErrorActionPreference = "Stop"

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "         ZenCord Discord Client          " -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[*] Fetching latest ZenCord installer..." -ForegroundColor Yellow

$installerUrl = "https://github.com/turki-basha/ZenCord/releases/download/latest/ZenCordInstaller.exe"
$tempPath = Join-Path $env:TEMP "ZenCordInstaller.exe"

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch {}

try {
    Invoke-WebRequest -Uri $installerUrl -OutFile $tempPath -UseBasicParsing
    Write-Host "[+] Download complete: $tempPath" -ForegroundColor Green
    Write-Host "[*] Launching ZenCord Installer..." -ForegroundColor Cyan
    Start-Process -FilePath $tempPath
} catch {
    Write-Host "[-] Failed to download installer: $_" -ForegroundColor Red
    Exit 1
}
