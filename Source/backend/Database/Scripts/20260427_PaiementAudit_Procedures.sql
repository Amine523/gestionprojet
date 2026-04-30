-- Scripts pour la gestion de l'audit des paiements
-- Date: 2026-04-27

-- 1. Table de stockage (si elle n'existe pas)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PaiementAuditCore]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PaiementAuditCore](
        [Id] [nvarchar](50) NOT NULL,
        [PaiementId] [nvarchar](50) NOT NULL,
        [Action] [nvarchar](50) NOT NULL,
        [UtilisateurId] [nvarchar](50) NULL,
        [UtilisateurNom] [nvarchar](100) NULL,
        [Details] [nvarchar](max) NULL,
        [DateEvenement] [datetime] NOT NULL,
        [IpAddress] [nvarchar](50) NULL,
        CONSTRAINT [PK_PaiementAuditCore] PRIMARY KEY CLUSTERed ([Id] ASC)
    )
END
GO

-- 2. Procédure d'insertion
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_PaiementAudit_i]
    @Id nvarchar(50),
    @PaiementId nvarchar(50),
    @Action nvarchar(50),
    @UtilisateurId nvarchar(50) = NULL,
    @UtilisateurNom nvarchar(100) = NULL,
    @Details nvarchar(max) = NULL,
    @DateEvenement datetime,
    @IpAddress nvarchar(50) = NULL
AS
BEGIN
    INSERT INTO [dbo].[PaiementAuditCore] (Id, PaiementId, Action, UtilisateurId, UtilisateurNom, Details, DateEvenement, IpAddress)
    VALUES (@Id, @PaiementId, @Action, @UtilisateurId, @UtilisateurNom, @Details, @DateEvenement, @IpAddress)
END
GO

-- 3. Procédure de liste par paiement
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_PaiementAudit_s_Liste_ParPaiement]
    @PaiementId nvarchar(50)
AS
BEGIN
    SELECT * FROM [dbo].[PaiementAuditCore]
    WHERE PaiementId = @PaiementId
    ORDER BY DateEvenement DESC
END
GO

-- 4. Procédure de liste par condition (Audit Global)
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_PaiementAudit_s_Liste_ParCondition]
    @condition nvarchar(max) = ''
AS
BEGIN
    DECLARE @sql nvarchar(max)
    SET @sql = 'SELECT * FROM [dbo].[PaiementAuditCore] '
    IF @condition <> ''
        SET @sql = @sql + ' WHERE ' + @condition
    SET @sql = @sql + ' ORDER BY DateEvenement DESC'
    
    EXEC sp_executesql @sql
END
GO
