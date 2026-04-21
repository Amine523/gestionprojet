USE [GestionProjetDB];
GO

-- Nettoyage
DELETE FROM ChatMessages; DELETE FROM ChatRoomMembers; DELETE FROM ChatRooms;
DELETE FROM DemandesConge; DELETE FROM Paiements; DELETE FROM Abonnements;
DELETE FROM Notifications; DELETE FROM Contacts; DELETE FROM BlockedIPs;
DELETE FROM DemandeLog;
GO

-- 1. Abonnements
INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Actif) VALUES 
('ABO001', 'SOC001', 'Premium', '20260101', '20261231', 1),
('ABO002', 'SOC002', 'Basic', '20260201', '20260801', 1);

-- 2. Paiements
INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type) VALUES 
('PAY001', 'SOC001', 'Aura Tech', 'Abonnement Annuel', 1200.00, GETDATE(), 'Validé', 'Virement'),
('PAY002', 'SOC002', 'Soft Pro', 'Abonnement Mensuel', 150.00, GETDATE(), 'En attente', 'Carte');

-- 3. DemandesConge
INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, ValideParId) VALUES 
('CNG001', 'USR001', 'TP001', '20260501', '20260505', 'Approuvé', 'Vacances été', 'ADM001');

-- 4. ChatRooms
INSERT INTO ChatRooms (Id, Nom, ProjetId, Actif) VALUES 
('CHAT001', 'Général', 'PRJ001', 1),
('CHAT002', 'Développement', 'PRJ001', 1);

-- 5. ChatRoomMembers
INSERT INTO ChatRoomMembers (Id, ChatRoomId, UtilisateurId) VALUES 
('CRM001', 'CHAT001', 'USR001'),
('CRM002', 'CHAT002', 'USR001');

-- 6. ChatMessages
INSERT INTO ChatMessages (Id, ChatRoomId, ExpediteurId, Message, DateEnvoi, EstLu) VALUES 
('MSG001', 'CHAT001', 'USR001', 'Bonjour tout le monde !', GETDATE(), 0);

-- 7. Notifications
INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu, DateCreation) VALUES 
('NOT001', 'USR001', 'Bienvenue', 'Bienvenue sur la plateforme Aura Core v2', 0, GETDATE());

-- 8. Contacts
INSERT INTO Contacts (Id, SocieteId, Nom, Email, Telephone, Actif) VALUES 
('CON001', 'SOC001', 'Jean Dupont', 'jean@auratech.com', '0123456789', 1);

-- 9. BlockedIPs
INSERT INTO BlockedIPs (Id, IPAddress, Reason, DateBlocked) VALUES 
('BIP001', '192.168.1.100', 'Tentatives de login suspectes', GETDATE());

-- 10. DemandeLog
INSERT INTO DemandeLog (Id, UtilisateurId, UtilisateurNom, Action, Description, EntiteType, EntiteId, IpAddress, DateCreation) VALUES 
('LOG001', 'USR001', 'Admin', 'LOGIN', 'Connexion au système', 'Auth', 'USR001', '127.0.0.1', GETDATE());

GO
