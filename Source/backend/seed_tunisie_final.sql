-- =====================================================
-- NADHEMNI - Script Données Tunisie (Tables Existantes)
-- Base de données: GestionProjetDB
-- =====================================================

USE [GestionProjetDB];
GO

-- =====================================================
-- SUPPRESSION DES DONNÉES
-- =====================================================

DELETE FROM ChatMessages;
DELETE FROM ChatRoomMembers;
DELETE FROM ChatRooms;
DELETE FROM DemandesConge;
DELETE FROM Paiements;
DELETE FROM Abonnements;
DELETE FROM Notifications;
DELETE FROM Contacts;
DELETE FROM BlockedIPs;
DELETE FROM DemandeLog;
GO

PRINT 'Données existantes supprimées.';
GO

-- =====================================================
-- 1. SOCIÉTÉS TUNISIENNES
-- =====================================================

INSERT INTO Societes (Id, Nom, Domaine, Email, Telephone, Adresse, Logo, Couleur, Actif, DateCreation) VALUES 
('SOC001', 'Soft Pro Solutions', 'softpro.tn', 'contact@softpro.tn', '21655100000', 'Avenue Habib Bourguiba, Tunis', NULL, '#8b5cf6', 1, GETDATE()),
('SOC002', 'Tech Tunisia', 'techtunisia.tn', 'contact@techtunisia.tn', '21671200000', 'Rue de la Palestine, Tunis', NULL, '#3b82f6', 1, GETDATE()),
('SOC003', 'Digital Connect', 'digitalconnect.tn', 'contact@digitalconnect.tn', '21673300000', 'Boulevard du 14 Janvier, Sfax', NULL, '#10b981', 1, GETDATE()),
('SOC004', 'Innovate Tech', 'innovatetech.tn', 'contact@innovatetech.tn', '21674400000', 'Rue Ibn Khaldoun, Sousse', NULL, '#f59e0b', 1, GETDATE()),
('SOC005', 'Smart Tech', 'smarttech.tn', 'contact@smarttech.tn', '21675500000', 'Avenue 7 Novembre, Kairouan', NULL, '#ef4444', 1, GETDATE()),
('SOC006', 'Carthage Digital', 'carthage.tn', 'contact@carthage.tn', '21679600000', 'Rue des Roses, Carthage', NULL, '#ec4899', 1, GETDATE()),
('SOC007', 'Medina Tech', 'medinatech.tn', 'contact@medinatech.tn', '21676700000', 'Avenue de la Liberte, Monastir', NULL, '#6366f1', 1, GETDATE()),
('SOC008', 'Sfax IT', 'sfaxit.tn', 'contact@sfaxit.tn', '21674800000', 'Route de lAerodrome, Sfax', NULL, '#14b8a6', 1, GETDATE());

PRINT '8 Societes inserees.';
GO

-- =====================================================
-- 2. TYPES D'UTILISATEURS
-- =====================================================

INSERT INTO TypeUtilisateurs (Id, Nom, Description, Actif) VALUES 
('T001', 'Super Administrateur', 'Administrateur de la plateforme', 1),
('T002', 'Admin Societe', 'Administrateur de la societe', 1),
('T003', 'RH', 'Responsable des ressources humaines', 1),
('T004', 'Chef de Projet', 'Chef de projet', 1),
('T005', 'Developpeur', 'Developpeur', 1),
('T006', 'Testeur', 'Testeur QA', 1),
('T007', 'Utilisateur', 'Utilisateur standard', 1);

PRINT '7 Types utilisateur inseres.';
GO

-- =====================================================
-- 3. UTILISATEURS PAR SOCIÉTÉ
-- =====================================================

-- Soft Pro Solutions (SOC001)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SP_ADM', 'SOC001', 'T002', 'Ben Ali', 'Mohamed', 'admin@softpro.tn', 'admin123', '21655100001', 'Tunis', 1, GETDATE()),
('SP_RH', 'SOC001', 'T003', 'Kraiem', 'Fatma', 'rh@softpro.tn', 'admin123', '21655100002', 'Tunis', 1, GETDATE()),
('SP_CHEF', 'SOC001', 'T004', 'Mansour', 'Slaheddine', 'chef@softpro.tn', 'admin123', '21655100003', 'Tunis', 1, GETDATE()),
('SP_DEV1', 'SOC001', 'T005', 'Mseddi', 'Leila', 'dev1@softpro.tn', 'admin123', '21655100004', 'Tunis', 1, GETDATE()),
('SP_DEV2', 'SOC001', 'T005', 'Bouazizi', 'Karim', 'dev2@softpro.tn', 'admin123', '21655100005', 'Sfax', 1, GETDATE()),
('SP_TEST', 'SOC001', 'T006', 'Ghanmi', 'Youssef', 'test@softpro.tn', 'admin123', '21655100006', 'Tunis', 1, GETDATE());

-- Tech Tunisia (SOC002)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('TT_ADM', 'SOC002', 'T002', 'Trabelsi', 'Samia', 'admin@techtunisia.tn', 'admin123', '21671200001', 'Tunis', 1, GETDATE()),
('TT_RH', 'SOC002', 'T003', 'Ben Hamida', 'Nour', 'rh@techtunisia.tn', 'admin123', '21671200002', 'Tunis', 1, GETDATE()),
('TT_CHEF', 'SOC002', 'T004', 'Khelifi', 'Mehdi', 'chef@techtunisia.tn', 'admin123', '21671200003', 'Tunis', 1, GETDATE()),
('TT_DEV1', 'SOC002', 'T005', 'Amara', 'Malek', 'dev1@techtunisia.tn', 'admin123', '21671200004', 'Sousse', 1, GETDATE()),
('TT_DEV2', 'SOC002', 'T005', 'Hamdi', 'Nadia', 'dev2@techtunisia.tn', 'admin123', '21671200005', 'Sousse', 1, GETDATE());

-- Digital Connect (SOC003)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('DC_ADM', 'SOC003', 'T002', 'Chaabane', 'Imed', 'admin@digitalconnect.tn', 'admin123', '21673300001', 'Sfax', 1, GETDATE()),
('DC_RH', 'SOC003', 'T003', 'Ben Ammar', 'Hichem', 'rh@digitalconnect.tn', 'admin123', '21673300002', 'Sfax', 1, GETDATE()),
('DC_CHEF', 'SOC003', 'T004', 'Lassoued', 'Tarek', 'chef@digitalconnect.tn', 'admin123', '21673300003', 'Sfax', 1, GETDATE()),
('DC_DEV1', 'SOC003', 'T005', 'Graa', 'Bilal', 'dev1@digitalconnect.tn', 'admin123', '21673300004', 'Sfax', 1, GETDATE()),
('DC_DEV2', 'SOC003', 'T005', 'Charfi', 'Hajer', 'dev2@digitalconnect.tn', 'admin123', '21673300005', 'Sfax', 1, GETDATE());

-- Innovate Tech (SOC004)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('IT_ADM', 'SOC004', 'T002', 'Ben Salem', 'Ahmed', 'admin@innovatetech.tn', 'admin123', '21674400001', 'Sousse', 1, GETDATE()),
('IT_DEV1', 'SOC004', 'T005', 'Benhassen', 'Sami', 'dev1@innovatetech.tn', 'admin123', '21674400002', 'Sousse', 1, GETDATE()),
('IT_CHEF', 'SOC004', 'T004', 'Melliti', 'Lotfi', 'chef@innovatetech.tn', 'admin123', '21674400003', 'Sousse', 1, GETDATE());

-- Super Administrateur
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SUPER_ADMIN', 'SUPER', 'T001', 'Admin', 'NADHEMNI', 'super@nademhni.tn', 'admin123', '21600000000', 'Tunis', 1, GETDATE());

PRINT '23 Utilisateurs inseres.';
GO

-- =====================================================
-- 4. PROJETS PAR SOCIÉTÉ
-- =====================================================

-- Soft Pro Solutions (SOC001)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_SP001', 'SOC001', 'Application Mobile iOS', 'Developpement application mobile pour clients', 'En cours', '20260101', '20260630', 45, 'SP_CHEF', 1, GETDATE()),
('PRJ_SP002', 'SOC001', 'API REST v2', 'Nouvelle version API REST avec microservices', 'En cours', '20260201', '20260731', 30, 'SP_CHEF', 1, GETDATE()),
('PRJ_SP003', 'SOC001', 'Dashboard Analytics', 'Tableau de bord pour analyse des donnees', 'En attente', '20260701', '20261231', 0, 'SP_CHEF', 1, GETDATE());

-- Tech Tunisia (SOC002)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_TT001', 'SOC002', 'Site Web Corporate', 'Refonte site web institutionnel', 'En cours', '20260115', '20260515', 65, 'TT_CHEF', 1, GETDATE()),
('PRJ_TT002', 'SOC002', 'E-commerce Platform', 'Plateforme e-commerce complete', 'En cours', '20260301', '20260831', 20, 'TT_CHEF', 1, GETDATE());

-- Digital Connect (SOC003)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_DC001', 'SOC003', 'Gestion Stock', 'Systeme de gestion de stock', 'En cours', '20260101', '20260430', 80, 'DC_CHEF', 1, GETDATE()),
('PRJ_DC002', 'SOC003', 'Application Paiement', 'Application de paiement mobile', 'En cours', '20260401', '20260930', 15, 'DC_CHEF', 1, GETDATE());

-- Innovate Tech (SOC004)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_IT001', 'SOC004', 'ERP System', 'Systeme ERP complet', 'En cours', '20260101', '20260630', 40, 'IT_CHEF', 1, GETDATE());

PRINT '8 Projets inseres.';
GO

-- =====================================================
-- 5. TÂCHES PAR PROJET
-- =====================================================

INSERT INTO Taches (Id, ProjetId, Titre, Description, Priorite, Statut, DateEcheance, Actif, DateCreation) VALUES 
('TACHE_SP001', 'PRJ_SP001', 'Analyse fonctionnelle', 'Redaction des specifications fonctionnelles', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_SP002', 'PRJ_SP001', 'Design UI/UX', 'Creation mockups et design interface', 'High', 'Done', '20260215', 1, GETDATE()),
('TACHE_SP003', 'PRJ_SP001', 'Implementation Authentification', 'Developpement module authentification OAuth', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_SP004', 'PRJ_SP001', 'Integration API', 'Connexion avec API backend', 'Medium', 'To Do', '20260315', 1, GETDATE()),
('TACHE_SP005', 'PRJ_SP001', 'Tests Unitaires', 'Ecriture tests unitaires', 'Medium', 'To Do', '20260401', 1, GETDATE()),
('TACHE_SP006', 'PRJ_SP002', 'Architecture Microservices', 'Conception architecture microservices', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_SP007', 'PRJ_SP002', 'API Utilisateurs', 'Developpement API gestion utilisateurs', 'High', 'To Do', '20260401', 1, GETDATE()),
('TACHE_SP008', 'PRJ_TT001', 'Design Homepage', 'Creation design page daccueil', 'Medium', 'Done', '20260215', 1, GETDATE()),
('TACHE_TT001', 'PRJ_TT001', 'Integration CMS', 'Integration systeme de gestion de contenu', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_DC001', 'PRJ_DC001', 'Module Stock', 'Developpement module gestion stock', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_DC002', 'PRJ_DC001', 'Rapports', 'Generation des rapports', 'Medium', 'In Progress', '20260315', 1, GETDATE());

PRINT '11 Taches inserees.';
GO

-- =====================================================
-- 6. DEMANDES DE CONGÉ
-- =====================================================

INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, ValideParId) VALUES 
('CNG_SP001', 'SP_DEV1', 'TP001', '20260415', '20260420', 'En_attente', 'Vacances printemps', 'SP_RH'),
('CNG_SP002', 'SP_DEV2', 'TP002', '20260410', '20260412', 'Approuve', 'Rendez-vous medical', 'SP_RH'),
('CNG_SP003', 'SP_TEST', 'TP001', '20260501', '20260505', 'En_attente', 'Voyage familial', 'SP_RH'),
('CNG_TT001', 'TT_DEV1', 'TP001', '20260420', '20260425', 'En_attente', 'Evenement familial', 'TT_RH'),
('CNG_DC001', 'DC_DEV1', 'TP001', '20260510', '20260515', 'En_attente', 'Vacances ete', 'DC_RH');

PRINT '5 Demandes conge inserees.';
GO

-- =====================================================
-- 7. ABONNEMENTS & PAIEMENTS
-- =====================================================

INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Actif) VALUES 
('ABO_SP001', 'SOC001', 'Premium', '20260101', '20261231', 1),
('ABO_TT001', 'SOC002', 'Basic', '20260101', '20260630', 1),
('ABO_DC001', 'SOC003', 'Standard', '20260101', '20260630', 1),
('ABO_IT001', 'SOC004', 'Premium', '20260101', '20261231', 1);

INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type) VALUES 
('PAY_SP001', 'SOC001', 'Soft Pro Solutions', 'Abonnement Premium Annuel', 2400.00, '20260105', 'Valide', 'Virement'),
('PAY_TT001', 'SOC002', 'Tech Tunisia', 'Abonnement Basic 6 mois', 600.00, '20260110', 'Valide', 'Carte'),
('PAY_DC001', 'SOC003', 'Digital Connect', 'Abonnement Standard 6 mois', 1200.00, '20260115', 'En attente', 'Virement'),
('PAY_IT001', 'SOC004', 'Innovate Tech', 'Abonnement Premium Annuel', 2400.00, '20260120', 'Valide', 'Virement');

PRINT '4 Abonnements et 4 Paiements inseres.';
GO

-- =====================================================
-- 8. CHAT (SALLE ET MEMBRES)
-- =====================================================

INSERT INTO ChatRooms (Id, Nom, ProjetId, Actif) VALUES 
('CHAT_SP001', 'General Soft Pro', 'PRJ_SP001', 1),
('CHAT_SP002', 'Developpement Soft Pro', 'PRJ_SP001', 1),
('CHAT_TT001', 'General Tech Tunisia', 'PRJ_TT001', 1),
('CHAT_DC001', 'General Digital Connect', 'PRJ_DC001', 1);

INSERT INTO ChatRoomMembers (Id, ChatRoomId, UtilisateurId) VALUES 
('CRM_SP001', 'CHAT_SP001', 'SP_ADM'),
('CRM_SP002', 'CHAT_SP001', 'SP_RH'),
('CRM_SP003', 'CHAT_SP001', 'SP_CHEF'),
('CRM_SP004', 'CHAT_SP001', 'SP_DEV1'),
('CRM_SP005', 'CHAT_SP002', 'SP_DEV1'),
('CRM_SP006', 'CHAT_SP002', 'SP_DEV2'),
('CRM_TT001', 'CHAT_TT001', 'TT_ADM'),
('CRM_TT002', 'CHAT_TT001', 'TT_CHEF'),
('CRM_DC001', 'CHAT_DC001', 'DC_ADM'),
('CRM_DC002', 'CHAT_DC001', 'DC_CHEF');

INSERT INTO ChatMessages (Id, ChatRoomId, ExpediteurId, Message, DateEnvoi, EstLu) VALUES 
('MSG_SP001', 'CHAT_SP001', 'SP_ADM', 'Bienvenue sur le chat de Soft Pro!', GETDATE(), 0),
('MSG_SP002', 'CHAT_SP001', 'SP_CHEF', 'Noubliez pas la reunion demain a 10h', GETDATE(), 0),
('MSG_TT001', 'CHAT_TT001', 'TT_ADM', 'Projet avance bien!', GETDATE(), 0);

PRINT '4 ChatRooms, 10 membres, 3 messages inseres.';
GO

-- =====================================================
-- 9. NOTIFICATIONS
-- =====================================================

INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu, DateCreation) VALUES 
('NOT_SP001', 'SP_ADM', 'Nouvelle tache assignee', 'Nouvelle tache Integration API vous a ete assignee', 0, GETDATE()),
('NOT_SP002', 'SP_RH', 'Demande de conge', 'Nouvelle demande de conge en attente de validation', 0, GETDATE()),
('NOT_SP003', 'SP_CHEF', 'Projet mis a jour', 'Le projet Application Mobile a atteint 45% de progression', 0, GETDATE()),
('NOT_TT001', 'TT_ADM', 'Candidat poste', 'Nouveau candidat pour le poste de Developpeur Mobile', 0, GETDATE()),
('NOT_DC001', 'DC_ADM', 'Tache terminee', 'La tache Module Stock est terminee', 0, GETDATE());

PRINT '5 Notifications inserees.';
GO

-- =====================================================
-- 10. CONTACTS
-- =====================================================

INSERT INTO Contacts (Id, SocieteId, Nom, Email, Telephone, Actif) VALUES 
('CON_SP001', 'SOC001', 'Client Alpha', 'alpha@client.tn', '21655110001', 1),
('CON_TT001', 'SOC002', 'Client Beta', 'beta@client.tn', '21671210001', 1),
('CON_DC001', 'SOC003', 'Client Gamma', 'gamma@client.tn', '21673310001', 1);

PRINT '3 Contacts inseres.';
GO

-- =====================================================
-- RÉSUMÉ
-- =====================================================

PRINT '';
PRINT '===============================================';
PRINT 'DONNEES TUNISIE INSEREES AVEC SUCCES!';
PRINT '===============================================';
PRINT '';
PRINT 'Societes: 8';
PRINT 'Types Utilisateur: 7';
PRINT 'Utilisateurs: 23';
PRINT 'Projets: 8';
PRINT 'Taches: 11';
PRINT 'Demandes Conge: 5';
PRINT 'Abonnements: 4';
PRINT 'Paiements: 4';
PRINT 'ChatRooms: 4';
PRINT 'ChatRoomMembers: 10';
PRINT 'ChatMessages: 3';
PRINT 'Notifications: 5';
PRINT 'Contacts: 3';
PRINT '';
GO