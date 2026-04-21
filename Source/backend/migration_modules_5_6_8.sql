/*
================================================================================
MODULE 5: SUIVI AVANCEMENT (Temps estimé vs réel, Alertes retard)
MODULE 6: GESTION RH (Absences, Solde Congés)
MODULE 8: NOTIFICATIONS (Email via ChatRooms)
================================================================================
*/

USE [GestionProjetDB];
GO

-- ================================================================================
-- MODULE 6: ABSENCES & SOLDE CONGÉS
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SoldesConge')
    CREATE TABLE [dbo].[SoldesConge] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [UtilisateurId] VARCHAR(100) NOT NULL,
        [Annee] INT NOT NULL,
        [SoldeInitial] DECIMAL(5,2) DEFAULT 0,
        [SoldePris] DECIMAL(5,2) DEFAULT 0,
        [SoldeRestant] DECIMAL(5,2) DEFAULT 0,
        [DateCalcul] DATETIME DEFAULT GETDATE()
    );
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Absences')
    CREATE TABLE [dbo].[Absences] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [UtilisateurId] VARCHAR(100) NOT NULL,
        [TypeAbsenceId] VARCHAR(100),
        [DateDebut] DATETIME NOT NULL,
        [DateFin] DATETIME NOT NULL,
        [NombreJours] DECIMAL(5,2),
        [Motif] NVARCHAR(500),
        [JustificationUrl] VARCHAR(255),
        [Status] VARCHAR(50), -- 'En_attente', 'Approuve', 'Rejete'
        [ValideParId] VARCHAR(100),
        [DateCreation] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- MODULE 5: SUIVI AVANCEMENT (Temps estimé vs réel)
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TacheTemps')
    CREATE TABLE [dbo].[TacheTemps] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TacheId] VARCHAR(100) NOT NULL,
        [UtilisateurId] VARCHAR(100) NOT NULL,
        [TempsEstimeMinutes] INT DEFAULT 0,
        [TempsReelMinutes] INT DEFAULT 0,
        [DateDebut] DATETIME,
        [DateFin] DATETIME,
        [DateMiseAJour] DATETIME DEFAULT GETDATE()
    );
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AlertesRetard')
    CREATE TABLE [dbo].[AlertesRetard] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TypeEntite] VARCHAR(50), -- 'Tache', 'Projet', 'Sprint'
        [EntiteId] VARCHAR(100) NOT NULL,
        [Message] NVARCHAR(500),
        [EstLue] BIT DEFAULT 0,
        [EstResolue] BIT DEFAULT 0,
        [DateAlerte] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- MODULE 8: NOTIFICATIONS EMAIL (utilise ChatRooms pour stockage)
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EmailNotifications')
    CREATE TABLE [dbo].[EmailNotifications] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [Destinataire] VARCHAR(255) NOT NULL,
        [Sujet] VARCHAR(255) NOT NULL,
        [Corps] NVARCHAR(MAX),
        [TypeNotification] VARCHAR(50), -- 'Conge', 'Tache', 'Test', 'Projet'
        [EntiteId] VARCHAR(100),
        [StatutEnvoi] VARCHAR(50), -- 'En_attente', 'Envoye', 'Echoue'
        [DateEnvoi] DATETIME,
        [Erreur] NVARCHAR(MAX),
        [DateCreation] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- PROCEDURES STOCKÉES: SOLDES CONGÉS
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_SoldeConge_i] 
    @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @Annee INT, @SoldeInitial DECIMAL(5,2), @SoldePris DECIMAL(5,2), @SoldeRestant DECIMAL(5,2)
AS BEGIN 
    INSERT INTO SoldesConge (Id, UtilisateurId, Annee, SoldeInitial, SoldePris, SoldeRestant) 
    VALUES (@Id, @UtilisateurId, @Annee, @SoldeInitial, @SoldePris, @SoldeRestant); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_SoldeConge_u] 
    @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @Annee INT, @SoldeInitial DECIMAL(5,2), @SoldePris DECIMAL(5,2), @SoldeRestant DECIMAL(5,2)
AS BEGIN 
    UPDATE SoldesConge SET SoldeInitial=@SoldeInitial, SoldePris=@SoldePris, SoldeRestant=@SoldeRestant WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_SoldeConge_s_ParUtilisateur] @UtilisateurId VARCHAR(100), @Annee INT
AS BEGIN SELECT * FROM SoldesConge WHERE UtilisateurId=@UtilisateurId AND Annee=@Annee END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_SoldeConge_s_Liste] AS BEGIN SELECT * FROM SoldesConge END
GO

-- ================================================================================
-- PROCEDURES STOCKÉES: ABSENCES
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_i] 
    @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @TypeAbsenceId VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME,
    @NombreJours DECIMAL(5,2), @Motif NVARCHAR(500), @JustificationUrl VARCHAR(255), @Status VARCHAR(50), @ValideParId VARCHAR(100)
AS BEGIN 
    INSERT INTO Absences (Id, UtilisateurId, TypeAbsenceId, DateDebut, DateFin, NombreJours, Motif, JustificationUrl, Status, ValideParId) 
    VALUES (@Id, @UtilisateurId, @TypeAbsenceId, @DateDebut, @DateFin, @NombreJours, @Motif, @JustificationUrl, @Status, @ValideParId); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_u] 
    @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @TypeAbsenceId VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME,
    @NombreJours DECIMAL(5,2), @Motif NVARCHAR(500), @JustificationUrl VARCHAR(255), @Status VARCHAR(50), @ValideParId VARCHAR(100)
AS BEGIN 
    UPDATE Absences SET UtilisateurId=@UtilisateurId, TypeAbsenceId=@TypeAbsenceId, DateDebut=@DateDebut, DateFin=@DateFin, 
    NombreJours=@NombreJours, Motif=@Motif, JustificationUrl=@JustificationUrl, Status=@Status, ValideParId=@ValideParId WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_d] @Id VARCHAR(100) AS BEGIN DELETE FROM Absences WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM Absences WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_s_Liste] AS BEGIN SELECT * FROM Absences END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_s_ParUtilisateur] @UtilisateurId VARCHAR(100) AS BEGIN SELECT * FROM Absences WHERE UtilisateurId=@UtilisateurId END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Absence_s_EnAttente] AS BEGIN SELECT * FROM Absences WHERE Status='En_attente' END
GO

-- ================================================================================
-- PROCEDURES STOCKÉES: TACHE TEMPS (Estimation vs Réel)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TacheTemps_i] 
    @Id VARCHAR(100), @TacheId VARCHAR(100), @UtilisateurId VARCHAR(100), @TempsEstimeMinutes INT, @TempsReelMinutes INT, @DateDebut DATETIME, @DateFin DATETIME
AS BEGIN 
    INSERT INTO TacheTemps (Id, TacheId, UtilisateurId, TempsEstimeMinutes, TempsReelMinutes, DateDebut, DateFin) 
    VALUES (@Id, @TacheId, @UtilisateurId, @TempsEstimeMinutes, @TempsReelMinutes, @DateDebut, @DateFin); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TacheTemps_u] 
    @Id VARCHAR(100), @TacheId VARCHAR(100), @UtilisateurId VARCHAR(100), @TempsEstimeMinutes INT, @TempsReelMinutes INT, @DateDebut DATETIME, @DateFin DATETIME
AS BEGIN 
    UPDATE TacheTemps SET TempsEstimeMinutes=@TempsEstimeMinutes, TempsReelMinutes=@TempsReelMinutes, DateDebut=@DateDebut, DateFin=@DateFin WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TacheTemps_s_ParTache] @TacheId VARCHAR(100) AS BEGIN SELECT * FROM TacheTemps WHERE TacheId=@TacheId END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TacheTemps_s_ParUtilisateur] @UtilisateurId VARCHAR(100) AS BEGIN SELECT * FROM TacheTemps WHERE UtilisateurId=@UtilisateurId END
GO

-- ================================================================================
-- PROCEDURES STOCKÉES: ALERTES RETARD
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AlerteRetard_i] 
    @Id VARCHAR(100), @TypeEntite VARCHAR(50), @EntiteId VARCHAR(100), @Message NVARCHAR(500), @EstLue BIT, @EstResolue BIT
AS BEGIN 
    INSERT INTO AlertesRetard (Id, TypeEntite, EntiteId, Message, EstLue, EstResolue) 
    VALUES (@Id, @TypeEntite, @EntiteId, @Message, @EstLue, @EstResolue); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AlerteRetard_u] @Id VARCHAR(100), @EstLue BIT, @EstResolue BIT
AS BEGIN UPDATE AlertesRetard SET EstLue=@EstLue, EstResolue=@EstResolue WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AlerteRetard_s_Liste] AS BEGIN SELECT * FROM AlertesRetard WHERE EstResolue=0 ORDER BY DateAlerte DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AlerteRetard_s_NonLues] AS BEGIN SELECT * FROM AlertesRetard WHERE EstLue=0 AND EstResolue=0 END
GO

-- ================================================================================
-- PROCEDURES STOCKÉES: EMAIL NOTIFICATIONS
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_EmailNotification_i] 
    @Id VARCHAR(100), @Destinataire VARCHAR(255), @Sujet VARCHAR(255), @Corps NVARCHAR(MAX), @TypeNotification VARCHAR(50),
    @EntiteId VARCHAR(100), @StatutEnvoi VARCHAR(50), @DateEnvoi DATETIME, @Erreur NVARCHAR(MAX)
AS BEGIN 
    INSERT INTO EmailNotifications (Id, Destinataire, Sujet, Corps, TypeNotification, EntiteId, StatutEnvoi, DateEnvoi, Erreur) 
    VALUES (@Id, @Destinataire, @Sujet, @Corps, @TypeNotification, @EntiteId, @StatutEnvoi, @DateEnvoi, @Erreur); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_EmailNotification_s_Liste] AS BEGIN SELECT * FROM EmailNotifications ORDER BY DateCreation DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_EmailNotification_s_EnAttente] AS BEGIN SELECT * FROM EmailNotifications WHERE StatutEnvoi='En_attente' END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_EmailNotification_u_Statut] @Id VARCHAR(100), @StatutEnvoi VARCHAR(50), @DateEnvoi DATETIME, @Erreur NVARCHAR(MAX)
AS BEGIN UPDATE EmailNotifications SET StatutEnvoi=@StatutEnvoi, DateEnvoi=@DateEnvoi, Erreur=@Erreur WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO

PRINT '>>> Tables et procédures Modules 5, 6, 8 créés avec succès';
GO