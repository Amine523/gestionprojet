USE [GestionProjetDB];
GO

PRINT 'Starting migration for Projet table...';

-- 1. Add SocieteId column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projet' AND COLUMN_NAME = 'SocieteId')
    ALTER TABLE [Projet] ADD [SocieteId] NVARCHAR(50) NULL;

GO

-- 2. Update ps_ApiParamSociete_Projet_i
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_i]
  (
    @Id nvarchar(50),
    @Nom nvarchar(150),
    @SocieteId nvarchar(50) = null,
    @Description nvarchar(MAX) = null,
    @StartDate date = null,
    @EndDate date = null,
    @Status nvarchar(50) = null,
    @Priorite nvarchar(50) = null,
    @UtilisateurId nvarchar(50) = null,
    @Actif bit = null
  )
AS
BEGIN
	INSERT INTO [dbo].[Projet]
        ([Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif])
    VALUES
		(@Id, @Nom, @SocieteId, @Description, @StartDate, @EndDate, @Status, @Priorite, @UtilisateurId, @Actif);
	SELECT @@ROWCOUNT as [Rows Affected];
END
GO

-- 3. Update ps_ApiParamSociete_Projet_u
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_u]
  (
    @Id nvarchar(50),
    @Nom nvarchar(150),
    @SocieteId nvarchar(50) = null,
    @Description nvarchar(MAX) = null,
    @StartDate date = null,
    @EndDate date = null,
    @Status nvarchar(50) = null,
    @Priorite nvarchar(50) = null,
    @UtilisateurId nvarchar(50) = null,
    @Actif bit = null
  )
AS
BEGIN
    UPDATE [dbo].[Projet]
    SET [Nom] = @Nom,
        [SocieteId] = ISNULL(@SocieteId, [SocieteId]),
        [Description] = ISNULL(@Description, [Description]),
        [StartDate] = ISNULL(@StartDate, [StartDate]),
        [EndDate] = ISNULL(@EndDate, [EndDate]),
        [Status] = ISNULL(@Status, [Status]),
        [Priorite] = ISNULL(@Priorite, [Priorite]),
        [UtilisateurId] = ISNULL(@UtilisateurId, [UtilisateurId]),
        [Actif] = ISNULL(@Actif, [Actif])
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT as [Rows Affected];
END
GO

-- 4. Update Selection Procedures
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_s_Liste]
AS
BEGIN
    SELECT [Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif]
    FROM [dbo].[Projet]
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_s_Liste_ParCondition]
  (@Condition nvarchar(MAX))
AS
BEGIN
    DECLARE @Sql nvarchar(MAX)
    SET @Sql = N' SELECT [Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif]
	FROM [dbo].[Projet] WHERE ' + @Condition
    EXEC sp_executesql @Sql
	SELECT @@ROWCOUNT as [Rows Affected];
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_s_ParId]
  (@Id nvarchar(50))
AS
BEGIN
    SELECT [Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif]
    FROM [dbo].[Projet]
    WHERE [Id] = @Id
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_s_Liste_Page]
  (@PageNumero int, @PageTaille int)
AS
BEGIN
    SELECT [Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif]
    FROM [dbo].[Projet]
    ORDER BY [Id]
    OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY;

    SELECT COUNT(*) FROM [dbo].[Projet];
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Projet_s_Liste_ParCondition_Page]
  (@Condition nvarchar(MAX), @PageNumero int, @PageTaille int)
AS
BEGIN
    DECLARE @Sql nvarchar(MAX)
    SET @Sql = N' SELECT [Id], [Nom], [SocieteId], [Description], [StartDate], [EndDate], [Status], [Priorite], [UtilisateurId], [Actif]
	FROM [dbo].[Projet] WHERE ' + @Condition + 
    ' ORDER BY [Id] OFFSET ' + CAST((@PageNumero - 1) * @PageTaille AS nvarchar) + ' ROWS FETCH NEXT ' + CAST(@PageTaille AS nvarchar) + ' ROWS ONLY; ' +
    ' SELECT COUNT(*) FROM [dbo].[Projet] WHERE ' + @Condition
    EXEC sp_executesql @Sql
END
GO

PRINT 'Migration for Projet table completed.';
