$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

$sql = @"
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'
"@

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    
    $reader = $cmd.ExecuteReader()
    while ($reader.Read()) {
        Write-Host $reader["TABLE_NAME"]
    }
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}