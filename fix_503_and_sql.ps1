Import-Module WebAdministration
$appPool = "GestprojetApiPool"
$dbName = "GestionProjetDB"
$server = "DESKTOP-N4BE8UE"

Write-Host "--- REPARATION DU SERVEUR ET SECURITE SQL ---" -ForegroundColor Cyan
Write-Host "1. Reinitialisation de l'identite du pool IIS (Correction de l'erreur 503)..."
Set-ItemProperty "IIS:\AppPools\$appPool" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Start-WebAppPool -Name $appPool -ErrorAction SilentlyContinue

Write-Host "2. Configuration de l'acces SQL Server pour cet utilisateur IIS anonyme..."
$connString = "Server=$server;Database=master;Integrated Security=True;TrustServerCertificate=True;"
try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = @"
        IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'IIS APPPOOL\$appPool') 
            CREATE LOGIN [IIS APPPOOL\$appPool] FROM WINDOWS;
"@
    $cmd.ExecuteNonQuery() | Out-Null
    
    $cmd.CommandText = @"
        USE [$dbName]; 
        IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'IIS APPPOOL\$appPool') 
            CREATE USER [IIS APPPOOL\$appPool] FOR LOGIN [IIS APPPOOL\$appPool]; 
        EXEC sp_addrolemember 'db_owner', 'IIS APPPOOL\$appPool';
"@
    $cmd.ExecuteNonQuery() | Out-Null
    
    $conn.Close()
    Write-Host "Acces SQL parametre avec succes !" -ForegroundColor Green
} catch {
    Write-Host "Impossible de configurer SQL automatiquement : $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "3. Redemarrage de IIS..."
iisreset /restart

Write-Host "Termine ! Actualisez votre navigateur web." -ForegroundColor Magenta
pause
