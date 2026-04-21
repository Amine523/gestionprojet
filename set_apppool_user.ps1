Import-Module WebAdministration
Clear-Host
Write-Host "--- Configuration de l'utilisateur IIS (GestprojetApiPool) ---" -ForegroundColor Cyan
Write-Host ""
Write-Host "Veuillez entrer votre NOM D'UTILISATEUR WINDOWS et votre MOT DE PASSE."
Write-Host "C'est grace a cela que IIS pourra se connecter a la base de donnees SQL !" -ForegroundColor Yellow

# Boite de dialogue pour demander les identifiants
$cred = Get-Credential

if ($null -eq $cred) {
    Write-Host "Vous avez annule la saisie." -ForegroundColor Red
    pause
    exit
}

$user = $cred.UserName
$pass = $cred.GetNetworkCredential().Password

Write-Host "Application de l'utilisateur '$user' au pool d'applications..."

# On met l'identite sur "SpecificUser"
Set-ItemProperty "IIS:\AppPools\GestprojetApiPool" -Name "processModel.identityType" -Value "SpecificUser"
Set-ItemProperty "IIS:\AppPools\GestprojetApiPool" -Name "processModel.userName" -Value $user
Set-ItemProperty "IIS:\AppPools\GestprojetApiPool" -Name "processModel.password" -Value $pass

Write-Host "Redemarrage de l'API..."
iisreset /restart

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host " TERMINE ! IIS tourne avec votre utilisateur." -ForegroundColor Green
Write-Host " L'erreur SQL va disparaitre de Swagger !" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
pause
