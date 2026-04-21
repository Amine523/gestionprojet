Import-Module WebAdministration

$siteName = "GestprojetApi"
$appPoolName = "GestprojetApiPool"
$physicalPath = "C:\projet pfe\Sites\Gestprojet.Core.ApiParamSociete.WebApi"
$port = 31001

Clear-Host
Write-Host "Configuration du site Web sur IIS (Port $port)..." -ForegroundColor Cyan

# 1. Create Application Pool
if (!(Test-Path "IIS:\AppPools\$appPoolName")) {
    Write-Host "Création du pool d'applications '$appPoolName'..."
    New-WebAppPool -Name $appPoolName
    # ASP.NET Core should have 'No Managed Code' in IIS App Pool
    Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value ""
    Write-Host "Pool d'applications créé avec succès." -ForegroundColor Green
} else {
    Write-Host "Le pool d'applications '$appPoolName' existe déjà." -ForegroundColor Yellow
}

# 2. Create Website
if (!(Test-Path "IIS:\Sites\$siteName")) {
    Write-Host "Création du site Web '$siteName' sur le port $port..."
    New-Website -Name $siteName -Port $port -PhysicalPath $physicalPath -ApplicationPool $appPoolName
    Write-Host "Site Web créé avec succès." -ForegroundColor Green
} else {
    Write-Host "Le site Web '$siteName' existe déjà. Mise à jour du port vers $port..." -ForegroundColor Yellow
    
    # Remove old bindings and set the new one
    Clear-WebConfiguration -pspath "machine/webroot/apphost" -filter "system.applicationHost/sites/site[@name='$siteName']/bindings/binding"
    New-WebBinding -Name $siteName -Port $port -Protocol http
    
    Write-Host "Port mis à jour avec succès sur $port." -ForegroundColor Green
}

# 3. Grant Folder Permissions
Write-Host "Configuration des permissions de dossier..."
$acl = Get-Acl $physicalPath

# IIS_IUSRS
$permissionIIS = "BUILTIN\IIS_IUSRS", "ReadAndExecute, Synchronize", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleIIS = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionIIS
$acl.AddAccessRule($accessRuleIIS)

# AppPool Identity
$permissionAppPool = "IIS AppPool\$appPoolName", "ReadAndExecute, Synchronize", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleAppPool = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionAppPool
$acl.AddAccessRule($accessRuleAppPool)

# IUSR
$permissionIUSR = "NT AUTHORITY\IUSR", "ReadAndExecute, Synchronize", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleIUSR = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionIUSR
$acl.AddAccessRule($accessRuleIUSR)

Set-Acl $physicalPath $acl
Write-Host "Permissions ajoutées pour IIS_IUSRS, IUSR et $appPoolName." -ForegroundColor Green

# Redémarrer le site pour appliquer
Stop-Website -Name $siteName -ErrorAction SilentlyContinue
Start-Website -Name $siteName -ErrorAction SilentlyContinue

Write-Host "`nConfiguration terminée ! Le site est accessible à l'adresse :" -ForegroundColor Magenta
Write-Host "http://localhost:$port/swagger/index.html" -ForegroundColor White
Write-Host "`nAppuyez sur une touche pour quitter..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
