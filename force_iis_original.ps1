Import-Module WebAdministration

$siteName = "GestprojetApi"
$appPoolName = "GestprojetApiPool"
$physicalPath = "C:\projet pfe\Sites\Gestprojet.Core.ApiParamSociete.WebApi"
$port = 31001

Clear-Host
Write-Host "Reconfiguration du site IIS sur le dossier d'origine..." -ForegroundColor Cyan

# 1. Configuration du pool (No Managed Code pout ASP.NET Core)
if (!(Test-Path "IIS:\AppPools\$appPoolName")) {
    New-WebAppPool -Name $appPoolName
}
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"

# 2. Configuration du site
if (!(Test-Path "IIS:\Sites\$siteName")) {
    New-Website -Name $siteName -Port $port -PhysicalPath $physicalPath -ApplicationPool $appPoolName
}
Set-ItemProperty "IIS:\Sites\$siteName" -Name "physicalPath" -Value $physicalPath

# Forcer le port 31001 au cas ou
Clear-WebConfiguration -pspath "machine/webroot/apphost" -filter "system.applicationHost/sites/site[@name='$siteName']/bindings/binding"
New-WebBinding -Name $siteName -Port $port -Protocol http

# 3. Permisisons avec ICACLS (brute-force sur tout l'arbre pour etre 100% sur)
Write-Host "Application des permissions lourdes via icacls..." -ForegroundColor Cyan
& icacls "$physicalPath" /remove:d "IIS_IUSRS" /T 2>&1 | Out-Null
& icacls "$physicalPath" /remove:d "IUSR" /T 2>&1 | Out-Null

& icacls "C:\projet pfe" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX" 2>&1 | Out-Null
& icacls "C:\projet pfe\Sites" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX" 2>&1 | Out-Null

# Full Control sur le dossier API
& icacls "$physicalPath" /grant "IIS_IUSRS:(OI)(CI)F" /grant "IUSR:(OI)(CI)F" /grant "NETWORK SERVICE:(OI)(CI)F" /T 2>&1 | Out-Null
& icacls "$physicalPath" /grant "IIS AppPool\$appPoolName:(OI)(CI)F" /T 2>&1 | Out-Null
& icacls "$physicalPath" /grant "Tout le monde:(OI)(CI)F" /T 2>&1 | Out-Null

# 4. Redemarrage
Write-Host "Redemarrage d'IIS..." -ForegroundColor Cyan
iisreset /restart

Write-Host "Termine ! Le site $siteName pointe de nouveau sur $physicalPath" -ForegroundColor Green
Write-Host "Testez : http://localhost:31001/swagger/index.html" -ForegroundColor Magenta
pause
