/*
================================================================================
SCRIPT DE MIGRATION V2 CORRIGÉ - GestionProjetDB
================================================================================
*/

USE [GestionProjetDB];
GO

-- 1. TABLES
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Abonnements')
    CREATE TABLE [dbo].[Abonnements] ([Id] VARCHAR(100) PRIMARY KEY, [SocieteId] VARCHAR(100), [TypeAbonnement] VARCHAR(100), [DateDebut] DATETIME, [DateFin] DATETIME, [Actif] BIT DEFAULT 1);
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Paiements')
    CREATE TABLE [dbo].[Paiements] ([Id] VARCHAR(100) PRIMARY KEY, [SocieteId] VARCHAR(100), [SocieteNom] VARCHAR(255), [Description] VARCHAR(500), [Montant] DECIMAL(18,2), [Date] DATETIME DEFAULT GETDATE(), [Statut] VARCHAR(50), [Type] VARCHAR(50));
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DemandesConge')
    CREATE TABLE [dbo].[DemandesConge] ([Id] VARCHAR(100) PRIMARY KEY, [UtilisateurId] VARCHAR(100), [TypePointageId] VARCHAR(100), [DateDebut] DATETIME, [DateFin] DATETIME, [Status] VARCHAR(50), [Motif] VARCHAR(500), [ValideParId] VARCHAR(100));
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatRooms')
    CREATE TABLE [dbo].[ChatRooms] ([Id] VARCHAR(100) PRIMARY KEY, [Nom] VARCHAR(255), [ProjetId] VARCHAR(100), [Actif] BIT DEFAULT 1);
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatRoomMembers')
    CREATE TABLE [dbo].[ChatRoomMembers] ([Id] VARCHAR(100) PRIMARY KEY, [ChatRoomId] VARCHAR(100), [UtilisateurId] VARCHAR(100));
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatMessages')
    CREATE TABLE [dbo].[ChatMessages] ([Id] VARCHAR(100) PRIMARY KEY, [ChatRoomId] VARCHAR(100), [ExpediteurId] VARCHAR(100), [Message] NVARCHAR(MAX), [DateEnvoi] DATETIME DEFAULT GETDATE(), [EstLu] BIT DEFAULT 0);
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
    CREATE TABLE [dbo].[Notifications] ([Id] VARCHAR(100) PRIMARY KEY, [UtilisateurId] VARCHAR(100), [Titre] VARCHAR(255), [Contenu] NVARCHAR(MAX), [EstLu] BIT DEFAULT 0, [DateCreation] DATETIME DEFAULT GETDATE());
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Contacts')
    CREATE TABLE [dbo].[Contacts] ([Id] VARCHAR(100) PRIMARY KEY, [SocieteId] VARCHAR(100), [Nom] VARCHAR(255), [Email] VARCHAR(255), [Telephone] VARCHAR(50), [Actif] BIT DEFAULT 1);
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BlockedIPs')
    CREATE TABLE [dbo].[BlockedIPs] ([Id] VARCHAR(100) PRIMARY KEY, [IPAddress] VARCHAR(50), [Reason] VARCHAR(255), [DateBlocked] DATETIME DEFAULT GETDATE());
GO
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DemandeLog')
    CREATE TABLE [dbo].[DemandeLog] ([Id] VARCHAR(100) PRIMARY KEY, [UtilisateurId] VARCHAR(100), [UtilisateurNom] VARCHAR(255), [Action] VARCHAR(100), [Description] NVARCHAR(MAX), [EntiteType] VARCHAR(100), [EntiteId] VARCHAR(100), [IpAddress] VARCHAR(50), [DateCreation] DATETIME DEFAULT GETDATE());
GO

-- 2. PROCEDURES STOCKÉES EXPLICITES (Abonnement)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_i] @Id VARCHAR(100), @SocieteId VARCHAR(100), @TypeAbonnement VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME, @Actif BIT AS BEGIN INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Actif) VALUES (@Id, @SocieteId, @TypeAbonnement, @DateDebut, @DateFin, @Actif); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_u] @Id VARCHAR(100), @SocieteId VARCHAR(100), @TypeAbonnement VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME, @Actif BIT AS BEGIN UPDATE Abonnements SET SocieteId=@SocieteId, TypeAbonnement=@TypeAbonnement, DateDebut=@DateDebut, DateFin=@DateFin, Actif=@Actif WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_d] @Id VARCHAR(100) AS BEGIN DELETE FROM Abonnements WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM Abonnements WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_s_Liste] AS BEGIN SELECT * FROM Abonnements END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_s_Liste_Page] @PageNumero INT, @PageTaille INT AS BEGIN SELECT * FROM Abonnements ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY; SELECT COUNT(*) FROM Abonnements; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_s_Liste_ParCondition] @Condition NVARCHAR(MAX) AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM Abonnements WHERE ' + @Condition; EXEC sp_executesql @SQL; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_s_Liste_ParCondition_Page] @Condition NVARCHAR(MAX), @PageNumero INT, @PageTaille INT AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM Abonnements WHERE ' + @Condition + ' ORDER BY Id OFFSET ' + CAST((@PageNumero - 1) * @PageTaille AS VARCHAR) + ' ROWS FETCH NEXT ' + CAST(@PageTaille AS VARCHAR) + ' ROWS ONLY; SELECT COUNT(*) FROM Abonnements WHERE ' + @Condition; EXEC sp_executesql @SQL; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Abonnement_d_ParCondition] @CritereRecherche NVARCHAR(MAX) AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'DELETE FROM Abonnements WHERE ' + @CritereRecherche; EXEC sp_executesql @SQL; SELECT @@ROWCOUNT; END
GO

-- 3. PROCEDURES STOCKÉES EXPLICITES (Paiement)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_i] @Id VARCHAR(100), @SocieteId VARCHAR(100), @SocieteNom VARCHAR(255), @Description VARCHAR(500), @Montant DECIMAL(18,2), @Date DATETIME, @Statut VARCHAR(50), @Type VARCHAR(50) AS BEGIN INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type) VALUES (@Id, @SocieteId, @SocieteNom, @Description, @Montant, @Date, @Statut, @Type); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_u] @Id VARCHAR(100), @SocieteId VARCHAR(100), @SocieteNom VARCHAR(255), @Description VARCHAR(500), @Montant DECIMAL(18,2), @Date DATETIME, @Statut VARCHAR(50), @Type VARCHAR(50) AS BEGIN UPDATE Paiements SET SocieteId=@SocieteId, SocieteNom=@SocieteNom, Description=@Description, Montant=@Montant, Date=@Date, Statut=@Statut, Type=@Type WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_d] @Id VARCHAR(100) AS BEGIN DELETE FROM Paiements WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM Paiements WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_s_Liste] AS BEGIN SELECT * FROM Paiements END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_s_Liste_Page] @PageNumero INT, @PageTaille INT AS BEGIN SELECT * FROM Paiements ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY; SELECT COUNT(*) FROM Paiements; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Paiement_s_Liste_ParCondition] @Condition NVARCHAR(MAX) AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM Paiements WHERE ' + @Condition; EXEC sp_executesql @SQL; END
GO

-- 4. PROCEDURES STOCKÉES EXPLICITES (DemandeConge)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_i] @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @TypePointageId VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME, @Status VARCHAR(50), @Motif VARCHAR(500), @ValideParId VARCHAR(100) AS BEGIN INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, ValideParId) VALUES (@Id, @UtilisateurId, @TypePointageId, @DateDebut, @DateFin, @Status, @Motif, @ValideParId); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_u] @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @TypePointageId VARCHAR(100), @DateDebut DATETIME, @DateFin DATETIME, @Status VARCHAR(50), @Motif VARCHAR(500), @ValideParId VARCHAR(100) AS BEGIN UPDATE DemandesConge SET UtilisateurId=@UtilisateurId, TypePointageId=@TypePointageId, DateDebut=@DateDebut, DateFin=@DateFin, Status=@Status, Motif=@Motif, ValideParId=@ValideParId WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_d] @Id VARCHAR(100) AS BEGIN DELETE FROM DemandesConge WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM DemandesConge WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_s_Liste] AS BEGIN SELECT * FROM DemandesConge END
GO

-- Additional DemandeConge procedures
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_s_Liste_Page] @PageNumero INT, @PageTaille INT AS BEGIN SELECT * FROM DemandesConge ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY; SELECT COUNT(*) FROM DemandesConge; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_s_Liste_ParCondition] @Condition NVARCHAR(MAX) AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM DemandesConge WHERE ' + @Condition; EXEC sp_executesql @SQL; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_s_Liste_ParCondition_Page] @Condition NVARCHAR(MAX), @PageNumero INT, @PageTaille INT AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM DemandesConge WHERE ' + @Condition + ' ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY'; EXEC sp_executesql @SQL; SELECT COUNT(*) FROM DemandesConge; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeConge_d_ParCondition] @CritereRecherche NVARCHAR(MAX) AS BEGIN DELETE FROM DemandesConge WHERE @CritereRecherche; SELECT @@ROWCOUNT; END
GO

-- JourFerie procedures
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_i] @Id VARCHAR(100), @SocieteId VARCHAR(100), @Nom VARCHAR(255), @Date DATETIME, @Actif BIT, @DateCreation DATETIME AS BEGIN INSERT INTO JoursFeries (Id, SocieteId, Nom, Date, Actif, DateCreation) VALUES (@Id, @SocieteId, @Nom, @Date, @Actif, @DateCreation); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_u] @Id VARCHAR(100), @SocieteId VARCHAR(100), @Nom VARCHAR(255), @Date DATETIME, @Actif BIT, @DateCreation DATETIME AS BEGIN UPDATE JoursFeries SET SocieteId=@SocieteId, Nom=@Nom, Date=@Date, Actif=@Actif, DateCreation=@DateCreation WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_d] @Id VARCHAR(100) AS BEGIN DELETE FROM JoursFeries WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM JoursFeries WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_s_Liste] AS BEGIN SELECT * FROM JoursFeries END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_s_Liste_Page] @PageNumero INT, @PageTaille INT AS BEGIN SELECT * FROM JoursFeries ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY; SELECT COUNT(*) FROM JoursFeries; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_s_Liste_ParCondition] @Condition NVARCHAR(MAX) AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM JoursFeries WHERE ' + @Condition; EXEC sp_executesql @SQL; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_s_Liste_ParCondition_Page] @Condition NVARCHAR(MAX), @PageNumero INT, @PageTaille INT AS BEGIN DECLARE @SQL NVARCHAR(MAX) = 'SELECT * FROM JoursFeries WHERE ' + @Condition + ' ORDER BY Id OFFSET (@PageNumero - 1) * @PageTaille ROWS FETCH NEXT @PageTaille ROWS ONLY'; EXEC sp_executesql @SQL; SELECT COUNT(*) FROM JoursFeries; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_JourFerie_d_ParCondition] @CritereRecherche NVARCHAR(MAX) AS BEGIN DELETE FROM JoursFeries WHERE @CritereRecherche; SELECT @@ROWCOUNT; END
GO

-- 5. PROCEDURES STOCKÉES EXPLICITES (ChatRoom, ChatRoomMember, ChatMessage)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoom_i] @Id VARCHAR(100), @Nom VARCHAR(255), @ProjetId VARCHAR(100), @Actif BIT AS BEGIN INSERT INTO ChatRooms (Id, Nom, ProjetId, Actif) VALUES (@Id, @Nom, @ProjetId, @Actif); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoom_u] @Id VARCHAR(100), @Nom VARCHAR(255), @ProjetId VARCHAR(100), @Actif BIT AS BEGIN UPDATE ChatRooms SET Nom=@Nom, ProjetId=@ProjetId, Actif=@Actif WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoom_d] @Id VARCHAR(100) AS BEGIN DELETE FROM ChatRooms WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoom_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM ChatRooms WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoom_s_Liste] AS BEGIN SELECT * FROM ChatRooms END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoomMember_i] @Id VARCHAR(100), @ChatRoomId VARCHAR(100), @UtilisateurId VARCHAR(100) AS BEGIN INSERT INTO ChatRoomMembers (Id, ChatRoomId, UtilisateurId) VALUES (@Id, @ChatRoomId, @UtilisateurId); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoomMember_d] @Id VARCHAR(100) AS BEGIN DELETE FROM ChatRoomMembers WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatRoomMember_s_Liste] AS BEGIN SELECT * FROM ChatRoomMembers END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatMessage_i] @Id VARCHAR(100), @ChatRoomId VARCHAR(100), @ExpediteurId VARCHAR(100), @Message NVARCHAR(MAX), @DateEnvoi DATETIME, @EstLu BIT AS BEGIN INSERT INTO ChatMessages (Id, ChatRoomId, ExpediteurId, Message, DateEnvoi, EstLu) VALUES (@Id, @ChatRoomId, @ExpediteurId, @Message, @DateEnvoi, @EstLu); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ChatMessage_s_Liste] AS BEGIN SELECT * FROM ChatMessages END
GO

-- 6. PROCEDURES STOCKÉES EXPLICITES (Notification, Contact, BlockedIP, DemandeLog)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Notification_i] @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @Titre VARCHAR(255), @Contenu NVARCHAR(MAX), @EstLu BIT, @DateCreation DATETIME AS BEGIN INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu, DateCreation) VALUES (@Id, @UtilisateurId, @Titre, @Contenu, @EstLu, @DateCreation); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Notification_s_Liste] AS BEGIN SELECT * FROM Notifications END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Contact_i] @Id VARCHAR(100), @SocieteId VARCHAR(100), @Nom VARCHAR(255), @Email VARCHAR(255), @Telephone VARCHAR(50), @Actif BIT AS BEGIN INSERT INTO Contacts (Id, SocieteId, Nom, Email, Telephone, Actif) VALUES (@Id, @SocieteId, @Nom, @Email, @Telephone, @Actif); SELECT @@ROWCOUNT; END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_BlockedIP_i] @Id VARCHAR(100), @IPAddress VARCHAR(50), @Reason VARCHAR(255), @DateBlocked DATETIME AS BEGIN INSERT INTO BlockedIPs (Id, IPAddress, Reason, DateBlocked) VALUES (@Id, @IPAddress, @Reason, @DateBlocked); SELECT @@ROWCOUNT; END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeLog_i] @Id VARCHAR(100), @UtilisateurId VARCHAR(100), @UtilisateurNom VARCHAR(255), @Action VARCHAR(100), @Description NVARCHAR(MAX), @EntiteType VARCHAR(100), @EntiteId VARCHAR(100), @IpAddress VARCHAR(50), @DateCreation DATETIME AS BEGIN INSERT INTO DemandeLog (Id, UtilisateurId, UtilisateurNom, Action, Description, EntiteType, EntiteId, IpAddress, DateCreation) VALUES (@Id, @UtilisateurId, @UtilisateurNom, @Action, @Description, @EntiteType, @EntiteId, @IpAddress, @DateCreation); SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_DemandeLog_s_Liste] AS BEGIN SELECT * FROM DemandeLog END
GO

-- Note: Les procédures s_Liste_Page, s_Liste_ParCondition et s_Liste_ParCondition_Page sont essentielles pour le pattern Dapper.
-- Je les rajouterai pour chaque entité au fur et à mesure si nécessaire.
