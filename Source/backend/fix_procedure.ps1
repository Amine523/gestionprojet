$ErrorActionPreference = "Stop"

$connectionString = "Server=.;Database=GestionProjetDB;Trusted_Connection=True;TrustServerCertificate=True;"

try {
    $conn = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $conn.Open()
    
    $dropSql = "IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'ps_ApiParamSociete_Utilisateur_s_ParEmail') DROP PROCEDURE [dbo].[ps_ApiParamSociete_Utilisateur_s_ParEmail]"
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $dropSql
    $cmd.ExecuteNonQuery()
    
    $createSql = @"
CREATE PROCEDURE [dbo].[ps_ApiParamSociete_Utilisateur_s_ParEmail]
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif
    FROM Utilisateur WHERE Email = @Email;
END
"@
    $cmd.CommandText = $createSql
    $cmd.ExecuteNonQuery()
    
    Write-Host "Procédure corrigée!" -ForegroundColor Green
    
    $conn.Close()
}
catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    exit 1
}