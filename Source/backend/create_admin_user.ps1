$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

$sql = @"
SELECT Id, Nom, Email, TypeUtilisateurId FROM Utilisateur WHERE Email = 'admin@gestprojet.com'
"@

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    
    $reader = $cmd.ExecuteReader()
    if ($reader.Read()) {
        Write-Host "Utilisateur trouvé: $($reader['Email']), Type: $($reader['TypeUtilisateurId'])" -ForegroundColor Green
    } else {
        Write-Host "Utilisateur non trouvé - je le crée..." -ForegroundColor Yellow
        
        $reader.Close()
        
        $insertSql = @"
INSERT INTO Utilisateur (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation)
VALUES ('SUPER_ADMIN', 'SUPER', 'T001', 'Admin', 'GestProjet', 'admin@gestprojet.com', 'Admin123!', '21600000000', 'Tunis', 1, GETDATE())
"@
        $cmd.CommandText = $insertSql
        $cmd.ExecuteNonQuery()
        
        Write-Host "Utilisateur admin@gestprojet.com créé!" -ForegroundColor Green
    }
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}