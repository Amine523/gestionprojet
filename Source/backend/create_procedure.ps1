$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

$sql = @"
IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'ps_ApiParamSociete_Utilisateur_s_ParEmail')
BEGIN
    DECLARE @sql NVARCHAR(MAX)
    SET @sql = N'CREATE PROCEDURE [dbo].[ps_ApiParamSociete_Utilisateur_s_ParEmail]
    @Email NVARCHAR(150)
    AS
    BEGIN
        SET NOCOUNT ON;
        SELECT Id, Nom + '' '' + ISNULL(Prenom, '''') AS Nom, Email, MotDePasse, NULL AS CV, TypeUtilisateurId, SocieteId, NULL AS RoleId, Actif
        FROM Utilisateurs WHERE Email = @Email;
    END'
    EXEC sp_executesql @sql
END
"@

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    $cmd.ExecuteNonQuery()
    
    Write-Host "Procédure stockée ps_ApiParamSociete_Utilisateur_s_ParEmail créée avec succès!" -ForegroundColor Green
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}