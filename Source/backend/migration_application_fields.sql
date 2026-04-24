USE [GestionProjetDB];
GO

PRINT 'Starting migration for Application table...';

-- 1. Add columns if they don't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Type')
    ALTER TABLE [Application] ADD [Type] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'SocieteId')
    ALTER TABLE [Application] ADD [SocieteId] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'OffreId')
    ALTER TABLE [Application] ADD [OffreId] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Titre')
    ALTER TABLE [Application] ADD [Titre] NVARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Lieu')
    ALTER TABLE [Application] ADD [Lieu] NVARCHAR(255) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Salaire')
    ALTER TABLE [Application] ADD [Salaire] NVARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Poste')
    ALTER TABLE [Application] ADD [Poste] NVARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Application' AND COLUMN_NAME = 'Quiz')
    ALTER TABLE [Application] ADD [Quiz] NVARCHAR(100) NULL;

GO

-- 2. Update ps_ApiParamSociete_Application_i
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

-- 3. Update ps_ApiParamSociete_Application_u
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

-- 4. Update Selection Procedures
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Application_s_Liste]
AS
BEGIN
    SELECT [Id], [UtilisateurId], [SocieteId], [OffreId], [Titre], [Description], [AppelDate], [Statut], [Type], [Actif]
    FROM [dbo].[Application]
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Application_s_Liste_ParCondition]
  (@Condition nvarchar(MAX))
AS
BEGIN
    DECLARE @Sql nvarchar(MAX)
    SET @Sql = N' SELECT [Id], [UtilisateurId], [SocieteId], [OffreId], [Titre], [Description], [AppelDate], [Statut], [Type], [Actif]
	FROM [dbo].[Application] WHERE ' + @Condition
    EXEC sp_executesql @Sql
	SELECT @@ROWCOUNT as [Rows Affected];
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Application_s_ParId]
  (@Id nvarchar(50))
AS
BEGIN
    SELECT [Id], [UtilisateurId], [SocieteId], [OffreId], [Titre], [Description], [AppelDate], [Statut], [Type], [Actif]
    FROM [dbo].[Application]
    WHERE [Id] = @Id
END
GO

PRINT 'Migration for Application table completed.';
