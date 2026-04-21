Write-Host "Telechargement de .NET 8 Hosting Bundle..." -ForegroundColor Cyan

$url = "https://go.microsoft.com/fwlink/?linkid=2270928"
$installerPath = "$env:TEMP\dotnet-hosting-8-win.exe"

Invoke-WebRequest -Uri $url -OutFile $installerPath

Write-Host "Installation en cours (cela peut prendre quelques minutes)..." -ForegroundColor Yellow
Write-Host "Acceptez toute demande d'autorisation qui pourrait apparaitre." -ForegroundColor Yellow

$process = Start-Process -FilePath $installerPath -ArgumentList "/quiet", "/norestart", "OPT_NO_X86=1" -Wait -PassThru -Verb RunAs

if ($process.ExitCode -eq 0 -or $process.ExitCode -eq 3010) {
    Write-Host "Installation REUSSIE !" -ForegroundColor Green
    Write-Host "Redemarrage d'IIS pour prendre en compte le nouveau module..." -ForegroundColor Cyan
    iisreset /restart
    Write-Host "TERMINE ! Vous pouvez maintenant tester la page Web http://localhost:31001/swagger/index.html" -ForegroundColor Green
} else {
    Write-Host "Une erreur s'est produite lors de l'installation (Code: $($process.ExitCode))." -ForegroundColor Red
}

pause
