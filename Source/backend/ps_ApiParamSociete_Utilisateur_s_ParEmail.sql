-- =====================================================
-- Procédure stockée pour récupérer un utilisateur par email
-- Base de données: GestionProjetDB
-- Exécutez ce script dans SQL Server Management Studio
-- =====================================================

USE [GestionProjetDB];
GO

-- Supprimer la procédure si elle existe déjà
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'ps_ApiParamSociete_Utilisateur_s_ParEmail')
BEGIN
    DROP PROCEDURE [dbo].[ps_ApiParamSociete_Utilisateur_s_ParEmail];
END
GO

-- Créer la nouvelle procédure
CREATE PROCEDURE [dbo].[ps_ApiParamSociete_Utilisateur_s_ParEmail]
    @Email NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        Nom + ' ' + ISNULL(Prenom, '') AS Nom,
        Email,
        MotDePasse,
        NULL AS CV,
        TypeUtilisateurId,
        SocieteId,
        NULL AS RoleId,
        Actif
    FROM Utilisateurs
    WHERE Email = @Email;
END
GO

PRINT 'Procédure ps_ApiParamSociete_Utilisateur_s_ParEmail créée avec succès.';
GO