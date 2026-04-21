CREATE PROCEDURE [dbo].[ps_ApiParamSociete_Societe_u]
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
    
    SELECT @@ROWCOUNT;
END
