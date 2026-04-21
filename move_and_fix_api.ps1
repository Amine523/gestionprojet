Import-Module WebAdministration

$siteName = "GestprojetApi"
$oldPath = "C:\projet pfe\Sites\Gestprojet.Core.ApiParamSociete.WebApi"
$newPath = "C:\GestprojetWebApi"

# 1. Copier les fichiers
Write-Host "Copie des fichiers vers $newPath..." -ForegroundColor Cyan
if (!(Test-Path $newPath)) {
    New-Item -ItemType Directory -Force -Path $newPath | Out-Null
}
Copy-Item -Path "$oldPath\*" -Destination $newPath -Recurse -Force

# 2. Changer le chemin physique du site IIS
Write-Host "Mise a jour du site IIS pour pointer vers le nouveau dossier..." -ForegroundColor Cyan
Set-ItemProperty "IIS:\Sites\$siteName" -Name "physicalPath" -Value $newPath

# 3. Appliquer les pleines permissions sur le nouveau dossier
Write-Host "Application des permissions locales..." -ForegroundColor Cyan
$acl = Get-Acl $newPath

# AppPool Identity
$permissionAppPool = "IIS AppPool\GestprojetApiPool", "FullControl", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleAppPool = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionAppPool
$acl.AddAccessRule($accessRuleAppPool)

# IIS_IUSRS
$permissionIIS = "BUILTIN\IIS_IUSRS", "FullControl", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleIIS = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionIIS
$acl.AddAccessRule($accessRuleIIS)

# Utilisateurs
$permissionUsers = "BUILTIN\Users", "ReadAndExecute, Synchronize", "ContainerInherit, ObjectInherit", "None", "Allow"
$accessRuleUsers = New-Object System.Security.AccessControl.FileSystemAccessRule $permissionUsers
$acl.AddAccessRule($accessRuleUsers)

Set-Acl $newPath $acl
Write-Host "Permissions ajoutees." -ForegroundColor Green

# 4. Redemarrer l'application et IIS
Write-Host "Redemarrage de IIS..." -ForegroundColor Cyan
iisreset /restart

Write-Host "TERMINE ! Veuillez tester http://localhost:31001/swagger/index.html" -ForegroundColor Magenta
pause
