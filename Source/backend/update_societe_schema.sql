USE [GestionProjetDB];
GO

-- 1. Ajouter les colonnes à la table Societe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'TelephoneContact')
    ALTER TABLE Societe ADD TelephoneContact NVARCHAR(50);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'Email')
    ALTER TABLE Societe ADD Email NVARCHAR(100);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'CodePostale')
    ALTER TABLE Societe ADD CodePostale NVARCHAR(20);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'Ville')
    ALTER TABLE Societe ADD Ville NVARCHAR(100);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'Pays')
    ALTER TABLE Societe ADD Pays NVARCHAR(100);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'PersonneContact')
    ALTER TABLE Societe ADD PersonneContact NVARCHAR(100);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'Fax')
    ALTER TABLE Societe ADD Fax NVARCHAR(50);

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Societe') AND name = 'SiteWeb')
    ALTER TABLE Societe ADD SiteWeb NVARCHAR(255);
GO

-- 2. Mettre à jour la procédure d'insertion
OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Societe_i]
    @Id NVARCHAR(50),
    @Nom NVARCHAR(100),
    @Adresse NVARCHAR(255),
    @PlanAbonnement NVARCHAR(100),
    @Actif BIT,
    @TelephoneContact NVARCHAR(50) = NULL,
    @Email NVARCHAR(100) = NULL,
    @CodePostale NVARCHAR(20) = NULL,
    @Ville NVARCHAR(100) = NULL,
    @Pays NVARCHAR(100) = NULL,
    @PersonneContact NVARCHAR(100) = NULL,
    @Fax NVARCHAR(50) = NULL,
    @SiteWeb NVARCHAR(255) = NULL
AS
BEGIN
    INSERT INTO Societe (Id, Nom, Adresse, PlanAbonnement, Actif, TelephoneContact, Email, CodePostale, Ville, Pays, PersonneContact, Fax, SiteWeb)
    VALUES (@Id, @Nom, @Adresse, @PlanAbonnement, @Actif, @TelephoneContact, @Email, @CodePostale, @Ville, @Pays, @PersonneContact, @Fax, @SiteWeb);
    
    SELECT 1; -- Retourne 1 pour indiquer le succès à Dapper
END
GO

-- 3. Mettre à jour la procédure de modification
OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Societe_u]
    @Id NVARCHAR(50),
    @Nom NVARCHAR(100),
    @Adresse NVARCHAR(255),
    @PlanAbonnement NVARCHAR(100),
    @Actif BIT,
    @TelephoneContact NVARCHAR(50) = NULL,
    @Email NVARCHAR(100) = NULL,
    @CodePostale NVARCHAR(20) = NULL,
    @Ville NVARCHAR(100) = NULL,
    @Pays NVARCHAR(100) = NULL,
    @PersonneContact NVARCHAR(100) = NULL,
    @Fax NVARCHAR(50) = NULL,
    @SiteWeb NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE Societe
    SET Nom = @Nom,
        Adresse = @Adresse,
        PlanAbonnement = @PlanAbonnement,
        Actif = @Actif,
        TelephoneContact = @TelephoneContact,
        Email = @Email,
        CodePostale = @CodePostale,
        Ville = @Ville,
        Pays = @Pays,
        PersonneContact = @PersonneContact,
        Fax = @Fax,
        SiteWeb = @SiteWeb
    WHERE Id = @Id;
    
    SELECT @@ROWCOUNT; -- Retourne le nombre de lignes modifiées
END
GO
