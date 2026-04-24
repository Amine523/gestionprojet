-- Execute this script in SQL Server Management Studio or similar tool
-- to update the Application stored procedures

USE [GestionProjetDB];
GO

-- Update the insert stored procedure
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Application_i]
  (
    @Id nvarchar(50),
    @UtilisateurId nvarchar(50) = null,
    @SocieteId nvarchar(50) = null,
    @OffreId nvarchar(50) = null,
    @Titre nvarchar(255) = null,
    @Description nvarchar(MAX) = null,
    @Lieu nvarchar(255) = null,
    @Salaire nvarchar(100) = null,
    @Poste nvarchar(100) = null,
    @Quiz nvarchar(100) = null,
    @AppelDate date = null,
    @Statut nvarchar(50) = null,
    @Type nvarchar(50) = null,
    @Actif bit = null
  )
AS
BEGIN
	INSERT INTO [dbo].[Application]
        ([Id], [UtilisateurId], [SocieteId], [OffreId], [Titre], [Description], [Lieu], [Salaire], [Poste], [Quiz], [AppelDate], [Statut], [Type], [Actif])
    VALUES
		(@Id, @UtilisateurId, @SocieteId, @OffreId, @Titre, @Description, @Lieu, @Salaire, @Poste, @Quiz, @AppelDate, @Statut, @Type, @Actif);
	SELECT @@ROWCOUNT as [Rows Affected];
END
GO

-- Update the update stored procedure
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Application_u]
  (
    @Id nvarchar(50),
    @UtilisateurId nvarchar(50) = null,
    @SocieteId nvarchar(50) = null,
    @OffreId nvarchar(50) = null,
    @Titre nvarchar(255) = null,
    @Description nvarchar(MAX) = null,
    @Lieu nvarchar(255) = null,
    @Salaire nvarchar(100) = null,
    @Poste nvarchar(100) = null,
    @Quiz nvarchar(100) = null,
    @AppelDate date = null,
    @Statut nvarchar(50) = null,
    @Type nvarchar(50) = null,
    @Actif bit = null
  )
AS
BEGIN
    UPDATE [dbo].[Application]
    SET [UtilisateurId] = ISNULL(@UtilisateurId, [UtilisateurId]),
        [SocieteId] = ISNULL(@SocieteId, [SocieteId]),
        [OffreId] = ISNULL(@OffreId, [OffreId]),
        [Titre] = ISNULL(@Titre, [Titre]),
        [Description] = ISNULL(@Description, [Description]),
        [Lieu] = ISNULL(@Lieu, [Lieu]),
        [Salaire] = ISNULL(@Salaire, [Salaire]),
        [Poste] = ISNULL(@Poste, [Poste]),
        [Quiz] = ISNULL(@Quiz, [Quiz]),
        [AppelDate] = ISNULL(@AppelDate, [AppelDate]),
        [Statut] = ISNULL(@Statut, [Statut]),
        [Type] = ISNULL(@Type, [Type]),
        [Actif] = ISNULL(@Actif, [Actif])
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT as [Rows Affected];
END
GO

PRINT 'Stored procedures updated successfully.';
