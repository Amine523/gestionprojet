CREATE PROCEDURE [dbo].[ps_ApiParamSociete_Societe_i]
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
    
    SELECT 1;
END
