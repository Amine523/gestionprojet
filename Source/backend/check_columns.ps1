$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

$sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Utilisateur'"

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    
    $reader = $cmd.ExecuteReader()
    while ($reader.Read()) {
        Write-Host $reader["COLUMN_NAME"]
    }
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}