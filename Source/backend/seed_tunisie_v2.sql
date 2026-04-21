-- =====================================================
-- NADHEMNI - Script d'Insertion Données Tunisie
-- Base de données: GestionProjetDB
-- =====================================================

USE [GestionProjetDB];
GO

-- =====================================================
-- SUPPRESSION DE TOUTES LES DONNÉES
-- =====================================================

DELETE FROM ChatMessages;
DELETE FROM ChatRoomMembers;
DELETE FROM ChatRooms;
DELETE FROM DemandesConge;
DELETE FROM Pointages;
DELETE FROM JoursFeries;
DELETE FROM TacheAssignations;
DELETE FROM SousTaches;
DELETE FROM Taches;
DELETE FROM ProjetUtilisateurs;
DELETE FROM Permissions;
DELETE FROM Roles;
DELETE FROM Modules;
DELETE FROM Attachements;
DELETE FROM Applications;
DELETE FROM Tests;
DELETE FROM Notifications;
DELETE FROM Abonnements;
DELETE FROM Paiements;
DELETE FROM Types;
DELETE FROM TypeUtilisateurs;
DELETE FROM Utilisateurs;
DELETE FROM Projets;
DELETE FROM Societes;

DBCC CHECKIDENT ('Societes', RESEED, 0);
DBCC CHECKIDENT ('Utilisateurs', RESEED, 0);
DBCC CHECKIDENT ('Projets', RESEED, 0);
GO

-- =====================================================
-- 1. SOCIÉTÉS TUNISIENNES
-- =====================================================

INSERT INTO Societes (Id, Nom, Domaine, Email, Telephone, Adresse, Logo, Couleur, Actif, DateCreation) VALUES 
('SOC001', 'Soft Pro Solutions', 'softpro.tn', 'contact@softpro.tn', '+216 55 100 000', 'Avenue Habib Bourguiba, Tunis', NULL, '#8b5cf6', 1, GETDATE()),
('SOC002', 'Tech Tunisia', 'techtunisia.tn', 'contact@techtunisia.tn', '+216 71 200 000', 'Rue de la Palestine, Tunis', NULL, '#3b82f6', 1, GETDATE()),
('SOC003', 'Digital Connect', 'digitalconnect.tn', 'contact@digitalconnect.tn', '+216 73 300 000', 'Boulevard du 14 Janvier, Sfax', NULL, '#10b981', 1, GETDATE()),
('SOC004', 'Innovate Tech', 'innovatetech.tn', 'contact@innovatetech.tn', '+216 74 400 000', 'Rue Ibn Khaldoun, Sousse', NULL, '#f59e0b', 1, GETDATE()),
('SOC005', 'Smart Tech', 'smarttech.tn', 'contact@smarttech.tn', '+216 75 500 000', 'Avenue 7 Novembre, Kairouan', NULL, '#ef4444', 1, GETDATE()),
('SOC006', 'Carthage Digital', 'carthage.tn', 'contact@carthage.tn', '+216 79 600 000', 'Rue des Roses, Carthage', NULL, '#ec4899', 1, GETDATE()),
('SOC007', 'Medina Tech', 'medinatech.tn', 'contact@medinatech.tn', '+216 76 700 000', 'Avenue de la Liberté, Monastir', NULL, '#6366f1', 1, GETDATE()),
('SOC008', 'Sfax IT', 'sfaxit.tn', 'contact@sfaxit.tn', '+216 74 800 000', 'Route de l\'Aérodrome, Sfax', NULL, '#14b8a6', 1, GETDATE());
GO

-- =====================================================
-- 2. TYPES D'UTILISATEURS
-- =====================================================

INSERT INTO TypeUtilisateurs (Id, Nom, Description, Actif) VALUES 
('T001', 'Super Administrateur', 'Administrateur de la plateforme', 1),
('T002', 'Admin Société', 'Administrateur de la société', 1),
('T003', 'RH', 'Responsable des ressources humaines', 1),
('T004', 'Chef de Projet', 'Chef de projet / Chef d\'équipe', 1),
('T005', 'Développeur', 'Développeur / Ingénieur', 1),
('T006', 'Testeur', 'Testeur QA', 1),
('T007', 'Utilisateur', 'Utilisateur standard', 1);
GO

-- =====================================================
-- 3. UTILISATEURS PAR SOCIÉTÉ
-- =====================================================

-- Soft Pro Solutions (SOC001)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SP_ADM', 'SOC001', 'T002', 'Ben Ali', 'Mohamed', 'admin@softpro.tn', 'admin123', '+216 55 100 001', 'Tunis', 1, GETDATE()),
('SP_RH', 'SOC001', 'T003', 'Kraiem', 'Fatma', 'rh@softpro.tn', 'admin123', '+216 55 100 002', 'Tunis', 1, GETDATE()),
('SP_CHEF', 'SOC001', 'T004', 'Mansour', 'Slaheddine', 'chef@softpro.tn', 'admin123', '+216 55 100 003', 'Tunis', 1, GETDATE()),
('SP_DEV1', 'SOC001', 'T005', 'Mseddi', 'Leila', 'dev1@softpro.tn', 'admin123', '+216 55 100 004', 'Tunis', 1, GETDATE()),
('SP_DEV2', 'SOC001', 'T005', 'Bouazizi', 'Karim', 'dev2@softpro.tn', 'admin123', '+216 55 100 005', 'Sfax', 1, GETDATE()),
('SP_TEST', 'SOC001', 'T006', 'Ghanmi', 'Youssef', 'test@softpro.tn', 'admin123', '+216 55 100 006', 'Tunis', 1, GETDATE());

-- Tech Tunisia (SOC002)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('TT_ADM', 'SOC002', 'T002', 'Trabelsi', 'Samia', 'admin@techtunisia.tn', 'admin123', '+216 71 200 001', 'Tunis', 1, GETDATE()),
('TT_RH', 'SOC002', 'T003', 'Ben Hamida', 'Nour', 'rh@techtunisia.tn', 'admin123', '+216 71 200 002', 'Tunis', 1, GETDATE()),
('TT_CHEF', 'SOC002', 'T004', 'Khelifi', 'Mehdi', 'chef@techtunisia.tn', 'admin123', '+216 71 200 003', 'Tunis', 1, GETDATE()),
('TT_DEV1', 'SOC002', 'T005', 'Amara', 'Malek', 'dev1@techtunisia.tn', 'admin123', '+216 71 200 004', 'Sousse', 1, GETDATE()),
('TT_DEV2', 'SOC002', 'T005', 'Hamdi', 'Nadia', 'dev2@techtunisia.tn', 'admin123', '+216 71 200 005', 'Sousse', 1, GETDATE());

-- Digital Connect (SOC003)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('DC_ADM', 'SOC003', 'T002', 'Chaabane', 'Imed', 'admin@digitalconnect.tn', 'admin123', '+216 73 300 001', 'Sfax', 1, GETDATE()),
('DC_RH', 'SOC003', 'T003', 'Ben Ammar', 'Hichem', 'rh@digitalconnect.tn', 'admin123', '+216 73 300 002', 'Sfax', 1, GETDATE()),
('DC_CHEF', 'SOC003', 'T004', 'Lassoued', 'Tarek', 'chef@digitalconnect.tn', 'admin123', '+216 73 300 003', 'Sfax', 1, GETDATE()),
('DC_DEV1', 'SOC003', 'T005', 'Graa', 'Bilal', 'dev1@digitalconnect.tn', 'admin123', '+216 73 300 004', 'Sfax', 1, GETDATE()),
('DC_DEV2', 'SOC003', 'T005', 'Charfi', 'Hajer', 'dev2@digitalconnect.tn', 'admin123', '+216 73 300 005', 'Sfax', 1, GETDATE());

-- Super Administrateur
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SUPER_ADMIN', 'SUPER', 'T001', 'Admin', 'NADHEMNI', 'super@nademhni.tn', 'admin123', '+216 00 000 000', 'Tunis', 1, GETDATE());
GO

-- =====================================================
-- 4. PROJETS PAR SOCIÉTÉ
-- =====================================================

-- Soft Pro Solutions (SOC001)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_SP001', 'SOC001', 'Application Mobile iOS', 'Développement application mobile pour clients', 'En cours', '20260101', '20260630', 45, 'SP_CHEF', 1, GETDATE()),
('PRJ_SP002', 'SOC001', 'API REST v2', 'Nouvelle version API REST avec microservices', 'En cours', '20260201', '20260731', 30, 'SP_CHEF', 1, GETDATE()),
('PRJ_SP003', 'SOC001', 'Dashboard Analytics', 'Tableau de bord pour analyse des données', 'En attente', '20260701', '20261231', 0, 'SP_CHEF', 1, GETDATE());

-- Tech Tunisia (SOC002)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_TT001', 'SOC002', 'Site Web Corporate', 'Refonte site web institutionnel', 'En cours', '20260115', '20260515', 65, 'TT_CHEF', 1, GETDATE()),
('PRJ_TT002', 'SOC002', 'E-commerce Platform', 'Plateforme e-commerce complète', 'En cours', '20260301', '20260831', 20, 'TT_CHEF', 1, GETDATE());

-- Digital Connect (SOC003)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_DC001', 'SOC003', 'Gestion Stock', 'Système de gestion de stock', 'En cours', '20260101', '20260430', 80, 'DC_CHEF', 1, GETDATE()),
('PRJ_DC002', 'SOC003', 'Application Paiement', 'Application de paiement mobile', 'En cours', '20260401', '20260930', 15, 'DC_CHEF', 1, GETDATE());
GO

-- =====================================================
-- 5. TÂCHES PAR PROJET
-- =====================================================

INSERT INTO Taches (Id, ProjetId, Titre, Description, Priorite, Statut, DateEcheance, Actif, DateCreation) VALUES 
('TACHE_SP001', 'PRJ_SP001', 'Analyse fonctionnelle', 'Rédaction des spécifications fonctionnelles', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_SP002', 'PRJ_SP001', 'Design UI/UX', 'Création mockups et design interface', 'High', 'Done', '20260215', 1, GETDATE()),
('TACHE_SP003', 'PRJ_SP001', 'Implémentation Authentification', 'Développement module authentification OAuth', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_SP004', 'PRJ_SP001', 'Intégration API', 'Connexion avec API backend', 'Medium', 'To Do', '20260315', 1, GETDATE()),
('TACHE_SP005', 'PRJ_SP001', 'Tests Unitaires', 'Écriture tests unitaires', 'Medium', 'To Do', '20260401', 1, GETDATE()),
('TACHE_SP006', 'PRJ_SP002', 'Architecture Microservices', 'Conception architecture microservices', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_SP007', 'PRJ_SP002', 'API Utilisateurs', 'Développement API gestion utilisateurs', 'High', 'To Do', '20260401', 1, GETDATE()),
('TACHE_SP008', 'PRJ_SP002', 'API Projets', 'Dévelopment API gestion projets', 'Medium', 'To Do', '20260415', 1, GETDATE());
GO

-- =====================================================
-- 6. ASSIGNATIONS TÂCHES
-- =====================================================

INSERT INTO TacheAssignations (Id, TacheId, UtilisateurId, DateAssignation, Statut, Actif) VALUES 
('ASSIGN_SP001', 'TACHE_SP003', 'SP_DEV1', GETDATE(), 'In Progress', 1),
('ASSIGN_SP002', 'TACHE_SP004', 'SP_DEV2', GETDATE(), 'To Do', 1),
('ASSIGN_SP003', 'TACHE_SP005', 'SP_TEST', GETDATE(), 'To Do', 1),
('ASSIGN_SP004', 'TACHE_SP006', 'SP_DEV1', GETDATE(), 'In Progress', 1),
('ASSIGN_SP005', 'TACHE_SP007', 'SP_DEV2', GETDATE(), 'To Do', 1);
GO

-- =====================================================
-- 7. TYPES DE CONGÉS
-- =====================================================

INSERT INTO Types (Id, SocieteId, Nom, Code, Description, Actif) VALUES 
('TP001', 'SOC001', 'Congé Annuel', 'ANNUEL', 'Congé annuel réglementaire', 1),
('TP002', 'SOC001', 'Congé Maladie', 'MALADIE', 'Congé maladie avec certificat', 1),
('TP003', 'SOC001', 'Autorisation', 'AUTORISATION', 'Autorisation spéciale', 1),
('TP004', 'SOC001', 'Congé Sans Solde', 'SANS_SOLDE', 'Congé sans solde', 1),
('TP005', 'SOC002', 'Congé Annuel', 'ANNUEL', 'Congé annuel réglementaire', 1),
('TP006', 'SOC003', 'Congé Annuel', 'ANNUEL', 'Congé annuel réglementaire', 1);
GO

-- =====================================================
-- 8. DEMANDES DE CONGÉ
-- =====================================================

INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, AvecCertificat, Actif, DateCreation) VALUES 
('CNG_SP001', 'SP_DEV1', 'TP001', '20260415', '20260420', 'En_attente', 'Vacances printemps', 0, 1, GETDATE()),
('CNG_SP002', 'SP_DEV2', 'TP002', '20260410', '20260412', 'Approuve', 'Rendez-vous médical', 1, 1, GETDATE()),
('CNG_SP003', 'SP_TEST', 'TP001', '20260501', '20260505', 'En_attente', 'Voyage familial', 0, 1, GETDATE()),
('CNG_TT001', 'TT_DEV1', 'TP005', '20260420', '20260425', 'En_attente', 'Événement familial', 0, 1, GETDATE()),
('CNG_DC001', 'DC_DEV1', 'TP006', '20260510', '20260515', 'En_attente', 'Vacances été', 0, 1, GETDATE());
GO

-- =====================================================
-- 9. POINTAGES
-- =====================================================

INSERT INTO Pointages (Id, UtilisateurId, SocieteId, Date, HeureDebut, HeureFin, Actif, DateCreation) VALUES 
('POINT_SP001', 'SP_DEV1', 'SOC001', '20260410', '08:30', '17:30', 1, GETDATE()),
('POINT_SP002', 'SP_DEV1', 'SOC001', '20260411', '08:45', '17:15', 1, GETDATE()),
('POINT_SP003', 'SP_DEV2', 'SOC001', '20260410', '08:00', '16:30', 1, GETDATE()),
('POINT_SP004', 'SP_CHEF', 'SOC001', '20260410', '09:00', '18:00', 1, GETDATE()),
('POINT_TT001', 'TT_DEV1', 'SOC002', '20260410', '08:30', '17:30', 1, GETDATE()),
('POINT_TT002', 'TT_CHEF', 'SOC002', '20260410', '08:15', '17:45', 1, GETDATE());
GO

-- =====================================================
-- 10. JOURS FÉRIÉS TUNISIE
-- =====================================================

INSERT INTO JoursFeries (Id, SocieteId, Nom, DateDebut, DateFin, Actif, DateCreation) VALUES 
('JF_2026_1', 'SOC001', 'Jour de l\'An', '20260101', '20260101', 1, GETDATE()),
('JF_2026_2', 'SOC001', 'Révolution et Fête de la Jeunesse', '20260114', '20260114', 1, GETDATE()),
('JF_2026_3', 'SOC001', 'Fête de l\'Indépendance', '19560320', '19560320', 1, GETDATE()),
('JF_2026_4', 'SOC001', 'Fête du Travail', '20260501', '20260501', 1, GETDATE()),
('JF_2026_5', 'SOC001', 'Fête de la République', '20260625', '20260625', 1, GETDATE()),
('JF_2026_6', 'SOC001', 'Fête de la Évacuation', '20261015', '20261015', 1, GETDATE()),
('JF_2026_7', 'SOC001', 'Fête de l\'Indépendance', '20260320', '20260320', 1, GETDATE());
GO

-- =====================================================
-- 11. MODULES
-- =====================================================

INSERT INTO Modules (Id, Nom, Description, Icone, Actif, DateCreation) VALUES 
('MOD_AUTH', 'Authentification', 'Gestion des utilisateurs et connexions', 'security', 1, GETDATE()),
('MOD_PROJETS', 'Projets', 'Gestion des projets', 'folder', 1, GETDATE()),
('MOD_TACHES', 'Tâches', 'Gestion des tâches et backlog', 'assignment', 1, GETDATE()),
('MOD_RH', 'RH', 'Ressources humaines', 'people', 1, GETDATE()),
('MOD_POINTAGE', 'Pointage', 'Suivi des présences', 'access_time', 1, GETDATE()),
('MOD_CONGES', 'Congés', 'Gestion des congés', 'event_available', 1, GETDATE()),
('MOD_RECRUTEMENT', 'Recrutement', 'Gestion du recrutement', 'work', 1, GETDATE()),
('MOD_TESTS', 'Tests', 'Évaluations et tests', 'quiz', 1, GETDATE()),
('MOD_CHAT', 'Chat', 'Messagerie interne', 'chat', 1, GETDATE()),
('MOD_RAPPORTS', 'Rapports', 'Tableaux de bord et stats', 'bar_chart', 1, GETDATE());
GO

-- =====================================================
-- 12. RÔLES ET PERMISSIONS
-- =====================================================

INSERT INTO Roles (Id, Nom, Description, Actif) VALUES 
('ROLE_ADMIN', 'Administrateur', 'Rôle administrateur', 1),
('ROLE_USER', 'Utilisateur', 'Rôle utilisateur standard', 1);

INSERT INTO Permissions (Id, RoleId, ModuleId, Action, Actif) VALUES 
('PERM_AUTH_VIEW', 'ROLE_ADMIN', 'MOD_AUTH', 'view', 1),
('PERM_AUTH_EDIT', 'ROLE_ADMIN', 'MOD_AUTH', 'edit', 1),
('PERM_PROJ_VIEW', 'ROLE_ADMIN', 'MOD_PROJETS', 'view', 1),
('PERM_PROJ_EDIT', 'ROLE_ADMIN', 'MOD_PROJETS', 'edit', 1),
('PERM_TACHE_VIEW', 'ROLE_USER', 'MOD_TACHES', 'view', 1),
('PERM_TACHE_EDIT', 'ROLE_ADMIN', 'MOD_TACHES', 'edit', 1),
('PERM_RH_VIEW', 'ROLE_ADMIN', 'MOD_RH', 'view', 1),
('PERM_RH_EDIT', 'ROLE_ADMIN', 'MOD_RH', 'edit', 1);
GO

-- =====================================================
-- 13. OFFRES D'EMPLOI
-- =====================================================

INSERT INTO Applications (Id, SocieteId, Titre, Description, TypeContrat, Lieu, Salaire, Experience, Statut, DatePublication, Actif, DateCreation) VALUES 
('OFFRE_SP001', 'SOC001', 'Développeur Full Stack', 'Recherche développeur Full Stack Angular/.NET', 'CDI', 'Tunis', '1500-2500', '2-3 ans', 'Ouverte', GETDATE(), 1, GETDATE()),
('OFFRE_SP002', 'SOC001', 'Chef de Projet', 'Recherche chef de projet expérimenté', 'CDI', 'Tunis', '2500-3500', '5+ ans', 'Ouverte', GETDATE(), 1, GETDATE()),
('OFFRE_TT001', 'SOC002', 'Développeur Mobile', 'Recherche développeur Mobile iOS/Android', 'CDI', 'Tunis', '1200-2000', '1-2 ans', 'Ouverte', GETDATE(), 1, GETDATE()),
('OFFRE_DC001', 'SOC003', 'Développeur Backend', 'Recherche développeur Node.js/Python', 'CDI', 'Sfax', '1300-2200', '2-4 ans', 'Ouverte', GETDATE(), 1, GETDATE());
GO

-- =====================================================
-- 14. CANDIDATS
-- =====================================================

INSERT INTO Applications (Id, SocieteId, Titre, Description, TypeContrat, Lieu, Salaire, Experience, Statut, DatePublication, Actif, DateCreation,
    PostuleurNom, PostuleurEmail, PostuleurTelephone, CVPath, Observations, Status) VALUES 
('CAND_SP001', 'SOC001', 'Développeur Full Stack', 'Candidat: Ahmed Ben Salem', 'CDI', 'Tunis', '1800', '3 ans', 'Accepté', GETDATE(), 1, GETDATE(),
    'Ahmed Ben Salem', 'ahmed.bensalem@email.tn', '+216 50 123 456', NULL, 'Expérience solide en Angular', 'Accepté'),
('CAND_SP002', 'SOC001', 'Développeur Full Stack', 'Candidat: Sara Trimeche', 'CDI', 'Tunis', '1600', '2 ans', 'En cours', GETDATE(), 1, GETDATE(),
    'Sara Trimeche', 'sara.trimeche@email.tn', '+216 50 234 567', NULL, 'Bonne motivation', 'En_cours'),
('CAND_TT001', 'SOC002', 'Développeur Mobile', 'Candidat: Mohamed Jouini', 'CDI', 'Tunis', '1500', '1 an', 'Entretien', GETDATE(), 1, GETDATE(),
    'Mohamed Jouini', 'mohamed.jouini@email.tn', '+216 50 345 678', NULL, 'Appel prévu demain', 'Entretien');
GO

-- =====================================================
-- 15. ABONNEMENTS & PAIEMENTS
-- =====================================================

INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Montant, Statut, Actif, DateCreation) VALUES 
('ABO_SP001', 'SOC001', 'Premium', '20260101', '20261231', 2400.00, 'Actif', 1, GETDATE()),
('ABO_TT001', 'SOC002', 'Basic', '20260101', '20260630', 600.00, 'Actif', 1, GETDATE()),
('ABO_DC001', 'SOC003', 'Standard', '20260101', '20260630', 1200.00, 'Actif', 1, GETDATE());

INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type, Actif, DateCreation) VALUES 
('PAY_SP001', 'SOC001', 'Soft Pro Solutions', 'Abonnement Premium Annuel', 2400.00, '20260105', 'Validé', 'Virement', 1, GETDATE()),
('PAY_TT001', 'SOC002', 'Tech Tunisia', 'Abonnement Basic 6 mois', 600.00, '20260110', 'Validé', 'Carte', 1, GETDATE()),
('PAY_DC001', 'SOC003', 'Digital Connect', 'Abonnement Standard 6 mois', 1200.00, '20260115', 'En attente', 'Virement', 1, GETDATE());
GO

-- =====================================================
-- 16. NOTIFICATIONS
-- =====================================================

INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu, DateCreation) VALUES 
('NOT_SP001', 'SP_ADM', 'Nouvelle tâche assignée', 'Nouvelle tâche "Intégration API" vous a été assignée', 0, GETDATE()),
('NOT_SP002', 'SP_RH', 'Demande de congé', 'Nouvelle demande de congé en attente de validation', 0, GETDATE()),
('NOT_SP003', 'SP_CHEF', 'Projet mis à jour', 'Le projet "Application Mobile" a atteint 45% de progression', 0, GETDATE()),
('NOT_TT001', 'TT_ADM', 'Candidat postulé', 'Nouveau candidat pour le poste de Développeur Mobile', 0, GETDATE());
GO

-- =====================================================
-- 17. SALAIRES (TUNISIE)
-- =====================================================

-- Salaires minimum Tunisia 2026: ~450 TND
INSERT INTO Types (Id, SocieteId, Nom, Code, Description, Actif) VALUES 
('SAL_BASE', 'SOC001', 'Salaire de base', 'BASE', 'Salaire de base mensuel', 1),
('SAL_TRANSPORT', 'SOC001', 'Indemnité transport', 'TRANSPORT', 'Indemnité de transport', 1),
('SAL_REPAS', 'SOC001', 'Indemnité repas', 'REPAS', 'Indemnité de repas', 1);
GO

PRINT '===============================================';
PRINT 'Données Tunisie insérées avec succès !';
PRINT '===============================================';
PRINT ' Société: 8';
PRINT ' Utilisateurs: ~23';
PRINT ' Projets: 7';
PRINT ' Tâches: 8';
PRINT ' Congés: 5';
PRINT ' Pointages: 6';
PRINT ' Jours fériés: 7';
PRINT ' Offres: 4';
PRINT ' Candidats: 3';
PRINT ' Abonnements: 3';
PRINT ' Paiements: 3';
PRINT ' Notifications: 4';
GO