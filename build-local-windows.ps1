param(
    [switch]$Publish,
    [string]$Version = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "     Impuls Windows Desktop - Local Builder   " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Compile helper tools if not already present
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path "$csc")) {
    $csc = (Get-ChildItem "C:\Windows\Microsoft.NET\Framework64\v4.0*\csc.exe" | Select-Object -First 1).FullName
}

Write-Host "[1/5] Compiling native binary patchers..." -ForegroundColor Yellow
& $csc /nologo /out:"tools\PatchImpulsBinary.exe" "tools\PatchImpulsBinary.cs"
& $csc /nologo /out:"tools\ChangeIcon.exe" "tools\ChangeIcon.cs"

# 2. Download upstream base if needed
if (-not (Test-Path "tportable.zip")) {
    Write-Host "[2/5] Downloading upstream base portable binary..." -ForegroundColor Yellow
    curl.exe -L -o tportable.zip "https://telegram.org/dl/desktop/win64_portable"
} else {
    Write-Host "[2/5] Using cached tportable.zip..." -ForegroundColor Green
}

# 3. Extract portable binary
Write-Host "[3/5] Extracting Telegram portable package..." -ForegroundColor Yellow
tar -xf tportable.zip

# 4. Patch endpoints, DC, and RSA keys
Write-Host "[4/5] Patching Impuls DC (80.201.130.248:20443) and RSA keys..." -ForegroundColor Yellow
& "tools\PatchImpulsBinary.exe" "Telegram\Telegram.exe" "Telegram\Impuls.exe"

# 5. Inject Impuls kinetic icon
Write-Host "[5/5] Injecting Impuls kinetic icon..." -ForegroundColor Yellow
Start-Sleep -Milliseconds 500
& "tools\ChangeIcon.exe" "Telegram\Impuls.exe" "Telegram\Resources\art\icon256.ico"

# Clean up unpatched Telegram.exe
if (Test-Path "Telegram\Telegram.exe") {
    Remove-Item "Telegram\Telegram.exe" -Force
}

# Package dist
New-Item -ItemType Directory -Path "dist" -Force | Out-Null
Copy-Item "Telegram\Impuls.exe" -Destination "dist\Impuls.exe" -Force
Copy-Item "tools\README.txt" -Destination "Telegram\README.txt" -Force

Write-Host "Local build complete! Generated: dist\Impuls.exe" -ForegroundColor Green

if ($Publish) {
    if ([string]::IsNullOrWhiteSpace($Version)) {
        $Version = (Get-Content "Telegram\build\version").Trim()
    }
    Write-Host "Publishing release v$Version to GitHub..." -ForegroundColor Cyan
    $zipPath = "dist\Impuls-$Version-Windows-x64.zip"
    Compress-Archive -Path "Telegram\*" -DestinationPath $zipPath -Force
    gh release create "v$Version" "dist\Impuls.exe" $zipPath --title "Impuls Windows Desktop v$Version" --notes-file "CHANGELOG.md"
    Write-Host "Successfully published release v$Version!" -ForegroundColor Green
}
