$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

$sql = "SELECT Id, Nom, Email, MotDePasse, TypeUtilisateurId, SocieteId, Actif FROM Utilisateur WHERE Email = 'admin@gestprojet.com'"

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    
    $reader = $cmd.ExecuteReader()
    if ($reader.Read()) {
        Write-Host "Id: $($reader['Id'])"
        Write-Host "Nom: $($reader['Nom'])"
        Write-Host "Email: $($reader['Email'])"
        Write-Host "MotDePasse: $($reader['MotDePasse'])"
        Write-Host "TypeUtilisateurId: $($reader['TypeUtilisateurId'])"
        Write-Host "SocieteId: $($reader['SocieteId'])"
        Write-Host "Actif: $($reader['Actif'])"
    }
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}