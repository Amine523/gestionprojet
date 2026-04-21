Import-Module WebAdministration

$siteName = "SoftProNuGet"
$port = 30000
$path = "c:\projet pfe\Sites\SoftProNuGetWebServer"
$poolName = "SoftProNuGet"

Write-Host "--- Configuration de SoftProNuGet sur IIS (Port $port) ---" -ForegroundColor Cyan

# 1. Création du Pool d'Application
if (!(Test-Path "IIS:\AppPools\$poolName")) {
    Write-Host "Création de l'App Pool $poolName..."
    New-WebAppPool -Name $poolName
}
Set-ItemProperty "IIS:\AppPools\$poolName" -Name "managedRuntimeVersion" -Value "v4.0"
Set-ItemProperty "IIS:\AppPools\$poolName" -Name "managedPipelineMode" -Value "Integrated"

# 2. Création du Site Web
Write-Host "Configuration du site sur le port $port..."
If (Get-Website -Name $siteName) {
    Remove-Website -Name $siteName
}
New-Website -Name $siteName -Port $port -PhysicalPath $path -ApplicationPool $poolName -Force

Write-Host "--- Terminé ! ---" -ForegroundColor Green
Write-Host "Vous pouvez tester l'accès sur : http://localhost:$port/"
