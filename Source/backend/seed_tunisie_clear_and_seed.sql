-- =====================================================
-- NADHEMNI - Script Clear & Seed Donnees Tunisie
-- Base de donnees: GestionProjetDB
-- =====================================================

USE [GestionProjetDB];
GO

SET NOCOUNT ON;
PRINT '';
PRINT '===============================================';
PRINT 'DEBUT SUPPRESSION ET INSERTION DONNEES';
PRINT '===============================================';
PRINT '';

-- =====================================================
-- SUPPRESSION DES DONNEES TOUTES LES TABLES
-- =====================================================

DELETE FROM ReponsesCandidats;
DELETE FROM TestResults;
DELETE FROM Questions;
DELETE FROM Tests;
DELETE FROM Entretiens;
DELETE FROM Candidatures;
DELETE FROM OffresEmploi;
DELETE FROM Logs;
DELETE FROM Paiements;
DELETE FROM BlockedIPs;
DELETE FROM Applications;
DELETE FROM Contacts;
DELETE FROM Notifications;
DELETE FROM ChatMessages;
DELETE FROM ChatRoomMembers;
DELETE FROM ChatRooms;
DELETE FROM DemandesConge;
DELETE FROM Pointages;
DELETE FROM TypesPointage;
DELETE FROM TacheAssignees;
DELETE FROM ProjetUtilisateurs;
DELETE FROM ProjetMembres;
DELETE FROM SousTaches;
DELETE FROM Attachements;
DELETE FROM Taches;
DELETE FROM MembresDeProjet;
DELETE FROM Projets;
DELETE FROM ConnexionLogs;
DELETE FROM Permissions;
DELETE FROM Roles;
DELETE FROM Modules;
DELETE FROM Utilisateurs;
DELETE FROM TypeUtilisateurs;
DELETE FROM Abonnements;
DELETE FROM Societes;

PRINT 'Toutes les donnees supprimees.';
GO

-- =====================================================
-- 1. SOCIETES TUNISIENNES
-- =====================================================

SET IDENTITY_INSERT Societes ON;

INSERT INTO Societes (Id, Nom, Domaine, Email, Telephone, Adresse, Logo, Couleur, Actif, DateCreation) VALUES 
('SOC001', 'Tunisia Tech Solutions', 'tunisiatech.tn', 'contact@tunisiatech.tn', '21671100000', 'Avenue Habib Bourguiba, Tunis', NULL, '#8b5cf6', 1, GETDATE()),
('SOC002', 'Sfax Digital Center', 'sfaxdigital.tn', 'contact@sfaxdigital.tn', '21674200000', 'Rue Ibn Khaldoun, Sfax', NULL, '#3b82f6', 1, GETDATE()),
('SOC003', 'Carthage Innovation', 'carthageinnovation.tn', 'contact@carthageinnovation.tn', '21671800000', 'Boulevard du 14 Janvier, Tunis', NULL, '#10b981', 1, GETDATE()),
('SOC004', 'Sousse Software', 'soussesoft.tn', 'contact@soussesoft.tn', '21673200000', 'Avenue 7 Novembre, Sousse', NULL, '#f59e0b', 1, GETDATE()),
('SOC005', 'Nabeul Dev', 'nabeuldev.tn', 'contact@nabeuldev.tn', '21672200000', 'Rue de la Liberation, Nabeul', NULL, '#ef4444', 1, GETDATE()),
('SOC006', 'Monastir Systems', 'monastirsys.tn', 'contact@monastirsys.tn', '21673500000', 'Avenue de la Republique, Monastir', NULL, '#ec4899', 1, GETDATE()),
('SOC007', 'Kairouan IT', 'kairouanit.tn', 'contact@kairouanit.tn', '21677100000', 'Avenue Al-Azhar, Kairouan', NULL, '#6366f1', 1, GETDATE()),
('SOC008', 'Gabes Energy Tech', 'gabestech.tn', 'contact@gabestech.tn', '21675300000', 'Route de Medenine, Gabes', NULL, '#14b8a6', 1, GETDATE());

SET IDENTITY_INSERT Societes OFF;

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
('T007', 'Designer', 'Designer UI/UX', 1),
('T008', 'Utilisateur', 'Utilisateur standard', 1);

PRINT '8 Types utilisateur inseres.';
GO

-- =====================================================
-- 3. UTILISATEURS PAR SOCIETE
-- =====================================================

-- Tunisia Tech Solutions (SOC001)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('TTS_ADM', 'SOC001', 'T002', 'Ben Ali', 'Ahmed', 'admin@tunisiatech.tn', 'admin123', '21671100001', 'Tunis', 1, GETDATE()),
('TTS_RH', 'SOC001', 'T003', 'Kraiem', 'Fatma', 'rh@tunisiatech.tn', 'admin123', '21671100002', 'Tunis', 1, GETDATE()),
('TTS_CHEF1', 'SOC001', 'T004', 'Mansour', 'Slaheddine', 'chef1@tunisiatech.tn', 'admin123', '21671100003', 'Tunis', 1, GETDATE()),
('TTS_CHEF2', 'SOC001', 'T004', 'Trabelsi', 'Sonia', 'chef2@tunisiatech.tn', 'admin123', '21671100004', 'Ariana', 1, GETDATE()),
('TTS_DEV1', 'SOC001', 'T005', 'Mseddi', 'Leila', 'dev1@tunisiatech.tn', 'admin123', '21671100005', 'Tunis', 1, GETDATE()),
('TTS_DEV2', 'SOC001', 'T005', 'Bouazizi', 'Karim', 'dev2@tunisiatech.tn', 'admin123', '21671100006', 'Sfax', 1, GETDATE()),
('TTS_DEV3', 'SOC001', 'T005', 'Amara', 'Malek', 'dev3@tunisiatech.tn', 'admin123', '21671100007', 'Sousse', 1, GETDATE()),
('TTS_TEST', 'SOC001', 'T006', 'Ghanmi', 'Youssef', 'test@tunisiatech.tn', 'admin123', '21671100008', 'Tunis', 1, GETDATE()),
('TTS_DES', 'SOC001', 'T007', 'Ben Hamida', 'Nour', 'des@tunisiatech.tn', 'admin123', '21671100009', 'Tunis', 1, GETDATE());

-- Sfax Digital Center (SOC002)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SDC_ADM', 'SOC002', 'T002', 'Chaabane', 'Imed', 'admin@sfaxdigital.tn', 'admin123', '21674200001', 'Sfax', 1, GETDATE()),
('SDC_RH', 'SOC002', 'T003', 'Ben Ammar', 'Hichem', 'rh@sfaxdigital.tn', 'admin123', '21674200002', 'Sfax', 1, GETDATE()),
('SDC_CHEF', 'SOC002', 'T004', 'Khelifi', 'Mehdi', 'chef@sfaxdigital.tn', 'admin123', '21674200003', 'Sfax', 1, GETDATE()),
('SDC_DEV1', 'SOC002', 'T005', 'Lassoued', 'Tarek', 'dev1@sfaxdigital.tn', 'admin123', '21674200004', 'Sfax', 1, GETDATE()),
('SDC_DEV2', 'SOC002', 'T005', 'Graa', 'Bilal', 'dev2@sfaxdigital.tn', 'admin123', '21674200005', 'Sfax', 1, GETDATE()),
('SDC_TEST', 'SOC002', 'T006', 'Charfi', 'Hajer', 'test@sfaxdigital.tn', 'admin123', '21674200006', 'Sfax', 1, GETDATE());

-- Carthage Innovation (SOC003)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('CIN_ADM', 'SOC003', 'T002', 'Ben Salem', 'Rafik', 'admin@carthageinnovation.tn', 'admin123', '21671800001', 'Tunis', 1, GETDATE()),
('CIN_RH', 'SOC003', 'T003', 'Melliti', 'Lotfi', 'rh@carthageinnovation.tn', 'admin123', '21671800002', 'Tunis', 1, GETDATE()),
('CIN_CHEF', 'SOC003', 'T004', 'Benhassen', 'Sami', 'chef@carthageinnovation.tn', 'admin123', '21671800003', 'Tunis', 1, GETDATE()),
('CIN_DEV1', 'SOC003', 'T005', 'Hamdi', 'Nadia', 'dev1@carthageinnovation.tn', 'admin123', '21671800004', 'Tunis', 1, GETDATE()),
('CIN_DEV2', 'SOC003', 'T005', 'Sassi', 'Omar', 'dev2@carthageinnovation.tn', 'admin123', '21671800005', 'Nabeul', 1, GETDATE());

-- Sousse Software (SOC004)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SSO_ADM', 'SOC004', 'T002', 'Mbarek', 'Yassine', 'admin@soussesoft.tn', 'admin123', '21673200001', 'Sousse', 1, GETDATE()),
('SSO_RH', 'SOC004', 'T003', 'Bettaieb', 'Amira', 'rh@soussesoft.tn', 'admin123', '21673200002', 'Sousse', 1, GETDATE()),
('SSO_CHEF', 'SOC004', 'T004', 'Cherif', 'Abdelkader', 'chef@soussesoft.tn', 'admin123', '21673200003', 'Sousse', 1, GETDATE()),
('SSO_DEV1', 'SOC004', 'T005', 'Ayed', 'Mariem', 'dev1@soussesoft.tn', 'admin123', '21673200004', 'Sousse', 1, GETDATE()),
('SSO_DEV2', 'SOC004', 'T005', 'Rezgui', 'Anis', 'dev2@soussesoft.tn', 'admin123', '21673200005', 'Monastir', 1, GETDATE());

-- Nabeul Dev (SOC005)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('NBD_ADM', 'SOC005', 'T002', 'Sassi', 'Fares', 'admin@nabeuldev.tn', 'admin123', '21672200001', 'Nabeul', 1, GETDATE()),
('NBD_CHEF', 'SOC005', 'T004', 'Boughanmi', 'Walid', 'chef@nabeuldev.tn', 'admin123', '21672200002', 'Nabeul', 1, GETDATE()),
('NBD_DEV', 'SOC005', 'T005', 'Jarray', 'Ameni', 'dev@nabeuldev.tn', 'admin123', '21672200003', 'Nabeul', 1, GETDATE());

-- Monastir Systems (SOC006)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('MST_ADM', 'SOC006', 'T002', 'Bouafia', 'Sahbi', 'admin@monastirsys.tn', 'admin123', '21673500001', 'Monastir', 1, GETDATE()),
('MST_RH', 'SOC006', 'T003', 'Ben Ali', 'Mouna', 'rh@monastirsys.tn', 'admin123', '21673500002', 'Monastir', 1, GETDATE()),
('MST_CHEF', 'SOC006', 'T004', 'Kouki', 'Hatem', 'chef@monastirsys.tn', 'admin123', '21673500003', 'Monastir', 1, GETDATE()),
('MST_DEV1', 'SOC006', 'T005', 'Slama', 'Aya', 'dev1@monastirsys.tn', 'admin123', '21673500004', 'Monastir', 1, GETDATE()),
('MST_DEV2', 'SOC006', 'T005', 'Rahal', 'Mehdi', 'dev2@monastirsys.tn', 'admin123', '21673500005', 'Sfax', 1, GETDATE());

-- Kairouan IT (SOC007)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('KIT_ADM', 'SOC007', 'T002', 'Chouchane', 'Jamel', 'admin@kairouanit.tn', 'admin123', '21677100001', 'Kairouan', 1, GETDATE()),
('KIT_CHEF', 'SOC007', 'T004', 'Mahjoub', 'Bilel', 'chef@kairouanit.tn', 'admin123', '21677100002', 'Kairouan', 1, GETDATE()),
('KIT_DEV', 'SOC007', 'T005', 'Benali', 'Ikbel', 'dev@kairouanit.tn', 'admin123', '21677100003', 'Kairouan', 1, GETDATE());

-- Gabes Energy Tech (SOC008)
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('GET_ADM', 'SOC008', 'T002', 'Dridi', 'Riadh', 'admin@gabestech.tn', 'admin123', '21675300001', 'Gabes', 1, GETDATE()),
('GET_RH', 'SOC008', 'T003', 'Ben Younes', 'Sinda', 'rh@gabestech.tn', 'admin123', '21675300002', 'Gabes', 1, GETDATE()),
('GET_CHEF', 'SOC008', 'T004', 'Mekki', 'Hichem', 'chef@gabestech.tn', 'admin123', '21675300003', 'Gabes', 1, GETDATE()),
('GET_DEV1', 'SOC008', 'T005', 'Abdelkafi', 'Nader', 'dev1@gabestech.tn', 'admin123', '21675300004', 'Gabes', 1, GETDATE()),
('GET_DEV2', 'SOC008', 'T005', 'Haddad', 'Donia', 'dev2@gabestech.tn', 'admin123', '21675300005', 'Gabes', 1, GETDATE());

-- Super Administrateur
INSERT INTO Utilisateurs (Id, SocieteId, TypeUtilisateurId, Nom, Prenom, Email, MotDePasse, Telephone, Adresse, Actif, DateCreation) VALUES 
('SUPER_ADMIN', 'SUPER', 'T001', 'Admin', 'NADHEMNI', 'super@nademhni.tn', 'admin123', '21600000000', 'Tunis', 1, GETDATE());

PRINT '42 Utilisateurs inseres.';
GO

-- =====================================================
-- 4. MODULES ET ROLES
-- =====================================================

INSERT INTO Modules (Id, Nom, Description, Actif) VALUES 
('MOD001', 'Dashboard', 'Module tableau de bord', 1),
('MOD002', 'Projets', 'Module gestion des projets', 1),
('MOD003', 'Taches', 'Module gestion des taches', 1),
('MOD004', 'Equipes', 'Module gestion des equipes', 1),
('MOD005', 'RH', 'Module ressources humaines', 1),
('MOD006', 'Chat', 'Module de discussion', 1),
('MOD007', 'Parametres', 'Module parametres', 1),
('MOD008', 'Rapports', 'Module rapports et statistiques', 1);

INSERT INTO Roles (Id, Nom, Description, Actif) VALUES 
('ROL001', 'Admin', 'Role administrateur', 1),
('ROL002', 'Chef', 'Role chef de projet', 1),
('ROL003', 'Membre', 'Role membre', 1),
('ROL004', 'Invite', 'Role invite', 1);

PRINT '4 Modules et 4 Roles inseres.';
GO

-- =====================================================
-- 5. PROJETS PAR SOCIETE
-- =====================================================

-- Tunisia Tech Solutions (SOC001)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_TTS001', 'SOC001', 'Plateforme E-Learning', 'Developpement plateforme formation en ligne', 'En cours', '20260101', '20260630', 55, 'TTS_CHEF1', 1, GETDATE()),
('PRJ_TTS002', 'SOC001', 'Application Mobile Banking', 'Application mobile pour banking', 'En cours', '20260201', '20260731', 35, 'TTS_CHEF1', 1, GETDATE()),
('PRJ_TTS003', 'SOC001', 'Systeme de Gestion RH', 'Logiciel gestion ressources humaines', 'En cours', '20260301', '20260831', 20, 'TTS_CHEF2', 1, GETDATE()),
('PRJ_TTS004', 'SOC001', 'Dashboard Analytics', 'Tableau de bord analytique', 'En attente', '20260701', '20261231', 0, 'TTS_CHEF2', 1, GETDATE());

-- Sfax Digital Center (SOC002)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_SDC001', 'SOC002', 'Site Web Corporate', 'Refonte site web institutionnel', 'En cours', '20260115', '20260515', 70, 'SDC_CHEF', 1, GETDATE()),
('PRJ_SDC002', 'SOC002', 'Plateforme E-commerce', 'Plateforme e-commerce complete', 'En cours', '20260301', '20260831', 25, 'SDC_CHEF', 1, GETDATE()),
('PRJ_SDC003', 'SOC002', 'Application Mobile', 'Application mobile pour clients', 'Termine', '20250101', '20250331', 100, 'SDC_CHEF', 1, GETDATE());

-- Carthage Innovation (SOC003)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_CIN001', 'SOC003', 'ERP System', 'Systeme ERP complet', 'En cours', '20260101', '20260630', 45, 'CIN_CHEF', 1, GETDATE()),
('PRJ_CIN002', 'SOC003', 'CRM Solution', 'Solution gestion clients', 'En cours', '20260215', '20260731', 30, 'CIN_CHEF', 1, GETDATE());

-- Sousse Software (SOC004)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_SSO001', 'SOC004', 'Gestion Stock', 'Systeme de gestion de stock', 'En cours', '20260101', '20260430', 85, 'SSO_CHEF', 1, GETDATE()),
('PRJ_SSO002', 'SOC004', 'Point de Vente', 'Systeme POS', 'En cours', '20260401', '20260930', 15, 'SSO_CHEF', 1, GETDATE());

-- Nabeul Dev (SOC005)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_NBD001', 'SOC005', 'Application Livraison', 'Application de livraison', 'En cours', '20260101', '20260531', 60, 'NBD_CHEF', 1, GETDATE());

-- Monastir Systems (SOC006)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_MST001', 'SOC006', 'Platforme EduTech', 'Plateforme education', 'En cours', '20260101', '20260630', 40, 'MST_CHEF', 1, GETDATE()),
('PRJ_MST002', 'SOC006', 'Application Sport', 'Application gestion sport', 'En cours', '20260401', '20260930', 10, 'MST_CHEF', 1, GETDATE());

-- Kairouan IT (SOC007)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_KIT001', 'SOC007', 'Site Web', 'Site web institutionnel', 'En cours', '20260101', '20260430', 75, 'KIT_CHEF', 1, GETDATE());

-- Gabes Energy Tech (SOC008)
INSERT INTO Projets (Id, SocieteId, Nom, Description, Statut, DateDebut, DateFin, Avancee, ChefProjetId, Actif, DateCreation) VALUES 
('PRJ_GET001', 'SOC008', 'Systeme Gestion', 'Systeme de gestion', 'En cours', '20260115', '20260615', 50, 'GET_CHEF', 1, GETDATE()),
('PRJ_GET002', 'SOC008', 'Application Mobile', 'Application mobile', 'En cours', '20260301', '20260831', 20, 'GET_CHEF', 1, GETDATE());

PRINT '17 Projets inseres.';
GO

-- =====================================================
-- 6. TACHES PAR PROJET
-- =====================================================

INSERT INTO Taches (Id, ProjetId, Titre, Description, Priorite, Statut, DateEcheance, Actif, DateCreation) VALUES 
-- Taches pour Plateforme E-Learning (PRJ_TTS001)
('TACHE_TTS001', 'PRJ_TTS001', 'Analyse fonctionnelle', 'Redaction des specifications fonctionnelles', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_TTS002', 'PRJ_TTS001', 'Design UI/UX', 'Creation mockups et design interface', 'High', 'Done', '20260215', 1, GETDATE()),
('TACHE_TTS003', 'PRJ_TTS001', 'Implementation Authentification', 'Developpement module authentification OAuth', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_TTS004', 'PRJ_TTS001', 'Module Video Streaming', 'Developpement module video en streaming', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_TTS005', 'PRJ_TTS001', 'Integration Paiement', 'Integration systeme de paiement', 'Medium', 'To Do', '20260401', 1, GETDATE()),
('TACHE_TTS006', 'PRJ_TTS001', 'Tests Unitaires', 'Ecriture tests unitaires', 'Medium', 'To Do', '20260415', 1, GETDATE()),

-- Taches pour Application Mobile Banking (PRJ_TTS002)
('TACHE_TTS007', 'PRJ_TTS002', 'Architecture Microservices', 'Conception architecture microservices', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_TTS008', 'PRJ_TTS002', 'API Comptes', 'Developpement API gestion comptes', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_TTS009', 'PRJ_TTS002', 'Module Virement', 'Developpement module virement', 'Medium', 'To Do', '20260401', 1, GETDATE()),
('TACHE_TTS010', 'PRJ_TTS002', 'Notifications', 'Systeme de notifications', 'Medium', 'To Do', '20260415', 1, GETDATE()),

-- Taches pour Site Web Corporate (PRJ_SDC001)
('TACHE_SDC001', 'PRJ_SDC001', 'Design Homepage', 'Creation design page daccueil', 'Medium', 'Done', '20260215', 1, GETDATE()),
('TACHE_SDC002', 'PRJ_SDC001', 'Integration CMS', 'Integration systeme de gestion de contenu', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_SDC003', 'PRJ_SDC001', 'SEO Optimisation', 'Optimisation SEO', 'Medium', 'In Progress', '20260401', 1, GETDATE()),

-- Taches pour ERP System (PRJ_CIN001)
('TACHE_CIN001', 'PRJ_CIN001', 'Module Stock', 'Developpement module gestion stock', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_CIN002', 'PRJ_CIN001', 'Module Comptabilite', 'Developpement module comptabilite', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_CIN003', 'PRJ_CIN001', 'Module RH', 'Developpement module RH', 'High', 'To Do', '20260401', 1, GETDATE()),
('TACHE_CIN004', 'PRJ_CIN001', 'Rapports', 'Generation des rapports', 'Medium', 'To Do', '20260415', 1, GETDATE()),

-- Taches pour Gestion Stock (PRJ_SSO001)
('TACHE_SSO001', 'PRJ_SSO001', 'Analyse Requirements', 'Redaction des requirements', 'High', 'Done', '20260115', 1, GETDATE()),
('TACHE_SSO002', 'PRJ_SSO001', 'Developpement Core', 'Developpement du core applicatif', 'High', 'Done', '20260215', 1, GETDATE()),
('TACHE_SSO003', 'PRJ_SSO001', 'Integration Code Barre', 'Integration lecteur code barre', 'Medium', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_SSO004', 'PRJ_SSO001', 'Tests', 'Phase de tests', 'Medium', 'To Do', '20260401', 1, GETDATE()),

-- Taches pour Application Livraison (PRJ_NBD001)
('TACHE_NBD001', 'PRJ_NBD001', 'Design App', 'Design application mobile', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_NBD002', 'PRJ_NBD001', 'API Backend', 'Developpement API backend', 'High', 'In Progress', '20260301', 1, GETDATE()),
('TACHE_NBD003', 'PRJ_NBD001', 'Geolocalisation', 'Module geolocalisation', 'High', 'In Progress', '20260401', 1, GETDATE()),
('TACHE_NBD004', 'PRJ_NBD001', 'Suivi Livraisons', 'Module suivi livraisons', 'Medium', 'To Do', '20260501', 1, GETDATE()),

-- Taches pour Platforme EduTech (PRJ_MST001)
('TACHE_MST001', 'PRJ_MST001', 'Conception Architecture', 'Architecture de la plateforme', 'High', 'Done', '20260131', 1, GETDATE()),
('TACHE_MST002', 'PRJ_MST001', 'Module Cours', 'Developpement module cours', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_MST003', 'PRJ_MST001', 'Module Quiz', 'Developpement module quiz et evalutions', 'Medium', 'To Do', '20260415', 1, GETDATE()),

-- Taches pour Site Web (PRJ_KIT001)
('TACHE_KIT001', 'PRJ_KIT001', 'Mockups Design', 'Creation des mockups', 'High', 'Done', '20260115', 1, GETDATE()),
('TACHE_KIT002', 'PRJ_KIT001', 'Developpement Frontend', 'Developpement frontend', 'High', 'In Progress', '20260215', 1, GETDATE()),
('TACHE_KIT003', 'PRJ_KIT001', 'Developpement Backend', 'Developpement backend', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_KIT004', 'PRJ_KIT001', 'Tests et Validation', 'Tests et validation', 'Medium', 'Done', '20260415', 1, GETDATE()),

-- Taches pour Systeme Gestion (PRJ_GET001)
('TACHE_GET001', 'PRJ_GET001', 'Analyse', 'Analyse du projet', 'High', 'Done', '20260130', 1, GETDATE()),
('TACHE_GET002', 'PRJ_GET001', 'Developpement', 'Developpement application', 'High', 'In Progress', '20260315', 1, GETDATE()),
('TACHE_GET003', 'PRJ_GET001', 'Rapports', 'Module rapports', 'Medium', 'To Do', '20260415', 1, GETDATE());

PRINT '35 Taches inserees.';
GO

-- =====================================================
-- 7. TYPES DE POINTAGE
-- =====================================================

INSERT INTO TypesPointage (Id, Nom, Description, Actif) VALUES 
('TP001', 'Conge Paye', 'Conge paye annuel', 1),
('TP002', 'Conge Maladie', 'Conge medical', 1),
('TP003', 'Conge Sans Solde', 'Conge sans solde', 1),
('TP004', 'Permission', 'Permission exceptionnel', 1),
('TP005', 'Formation', 'Conge formation', 1);

PRINT '5 Types pointage inseres.';
GO

-- =====================================================
-- 8. DEMANDES DE CONGE
-- =====================================================

INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, ValideParId) VALUES 
('CNG_TTS001', 'TTS_DEV1', 'TP001', '20260515', '20260520', 'En_attente', 'Vacances printemps', 'TTS_RH'),
('CNG_TTS002', 'TTS_DEV2', 'TP002', '20260410', '20260412', 'Approuve', 'Rendez-vous medical', 'TTS_RH'),
('CNG_TTS003', 'TTS_TEST', 'TP001', '20260501', '20260505', 'En_attente', 'Voyage familial', 'TTS_RH'),
('CNG_SDC001', 'SDC_DEV1', 'TP001', '20260420', '20260425', 'En_attente', 'Evenement familial', 'SDC_RH'),
('CNG_SDC002', 'SDC_DEV2', 'TP004', '20260415', '20260415', 'Approuve', 'Rendez-vous administratif', 'SDC_RH'),
('CNG_CIN001', 'CIN_DEV1', 'TP001', '20260510', '20260515', 'En_attente', 'Vacances ete', 'CIN_RH'),
('CNG_SSO001', 'SSO_DEV1', 'TP001', '20260520', '20260525', 'En_attente', 'Vacances', 'SSO_RH'),
('CNG_MST001', 'MST_DEV1', 'TP002', '20260408', '20260410', 'Approuve', 'Conge médicale', 'MST_RH'),
('CNG_GET001', 'GET_DEV1', 'TP001', '20260505', '20260510', 'En_attente', 'Voyage', 'GET_RH');

PRINT '9 Demandes conge inserees.';
GO

-- =====================================================
-- 9. ABONNEMENTS ET PAIEMENTS
-- =====================================================

INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Actif) VALUES 
('ABO_TTS001', 'SOC001', 'Premium', '20260101', '20261231', 1),
('ABO_SDC001', 'SOC002', 'Basic', '20260101', '20260630', 1),
('ABO_CIN001', 'SOC003', 'Standard', '20260101', '20260630', 1),
('ABO_SSO001', 'SOC004', 'Premium', '20260101', '20261231', 1),
('ABO_NBD001', 'SOC005', 'Basic', '20260101', '20260630', 1),
('ABO_MST001', 'SOC006', 'Standard', '20260101', '20260630', 1),
('ABO_KIT001', 'SOC007', 'Basic', '20260101', '20260331', 1),
('ABO_GET001', 'SOC008', 'Premium', '20260101', '20261231', 1);

INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type) VALUES 
('PAY_TTS001', 'SOC001', 'Tunisia Tech Solutions', 'Abonnement Premium Annuel', 2400.00, '20260105', 'Valide', 'Virement'),
('PAY_SDC001', 'SOC002', 'Sfax Digital Center', 'Abonnement Basic 6 mois', 600.00, '20260110', 'Valide', 'Carte'),
('PAY_CIN001', 'SOC003', 'Carthage Innovation', 'Abonnement Standard 6 mois', 1200.00, '20260115', 'En attente', 'Virement'),
('PAY_SSO001', 'SOC004', 'Sousse Software', 'Abonnement Premium Annuel', 2400.00, '20260120', 'Valide', 'Virement'),
('PAY_NBD001', 'SOC005', 'Nabeul Dev', 'Abonnement Basic 6 mois', 600.00, '20260125', 'Valide', 'Carte'),
('PAY_MST001', 'SOC006', 'Monastir Systems', 'Abonnement Standard 6 mois', 1200.00, '20260201', 'Valide', 'Virement'),
('PAY_KIT001', 'SOC007', 'Kairouan IT', 'Abonnement Basic 3 mois', 300.00, '20260205', 'Valide', 'Carte'),
('PAY_GET001', 'SOC008', 'Gabes Energy Tech', 'Abonnement Premium Annuel', 2400.00, '20260210', 'Valide', 'Virement');

PRINT '8 Abonnements et 8 Paiements inseres.';
GO

-- =====================================================
-- 10. SALLE DE CHAT
-- =====================================================

INSERT INTO ChatRooms (Id, Nom, ProjetId, Actif) VALUES 
('CHAT_TTS001', 'General Tunisia Tech', 'PRJ_TTS001', 1),
('CHAT_TTS002', 'Developpement Tunisia Tech', 'PRJ_TTS001', 1),
('CHAT_SDC001', 'General Sfax Digital', 'PRJ_SDC001', 1),
('CHAT_CIN001', 'General Carthage', 'PRJ_CIN001', 1),
('CHAT_SSO001', 'General Sousse', 'PRJ_SSO001', 1),
('CHAT_NBD001', 'General Nabeul', 'PRJ_NBD001', 1);

INSERT INTO ChatRoomMembers (Id, ChatRoomId, UtilisateurId) VALUES 
('CRM_TTS001', 'CHAT_TTS001', 'TTS_ADM'),
('CRM_TTS002', 'CHAT_TTS001', 'TTS_RH'),
('CRM_TTS003', 'CHAT_TTS001', 'TTS_CHEF1'),
('CRM_TTS004', 'CHAT_TTS001', 'TTS_DEV1'),
('CRM_TTS005', 'CHAT_TTS002', 'TTS_DEV1'),
('CRM_TTS006', 'CHAT_TTS002', 'TTS_DEV2'),
('CRM_TTS007', 'CHAT_TTS002', 'TTS_DEV3'),
('CRM_SDC001', 'CHAT_SDC001', 'SDC_ADM'),
('CRM_SDC002', 'CHAT_SDC001', 'SDC_CHEF'),
('CRM_SDC003', 'CHAT_SDC001', 'SDC_DEV1'),
('CRM_CIN001', 'CHAT_CIN001', 'CIN_ADM'),
('CRM_CIN002', 'CHAT_CIN001', 'CIN_CHEF'),
('CRM_CIN003', 'CHAT_CIN001', 'CIN_DEV1'),
('CRM_SSO001', 'CHAT_SSO001', 'SSO_ADM'),
('CRM_SSO002', 'CHAT_SSO001', 'SSO_CHEF'),
('CRM_NBD001', 'CHAT_NBD001', 'NBD_ADM'),
('CRM_NBD002', 'CHAT_NBD001', 'NBD_CHEF');

INSERT INTO ChatMessages (Id, ChatRoomId, ExpediteurId, Message, DateEnvoi, EstLu) VALUES 
('MSG_TTS001', 'CHAT_TTS001', 'TTS_ADM', 'Bienvenue sur le chat de Tunisia Tech!', GETDATE(), 0),
('MSG_TTS002', 'CHAT_TTS001', 'TTS_CHEF1', 'Noubliez pas la reunion demain a 10h', GETDATE(), 0),
('MSG_SDC001', 'CHAT_SDC001', 'SDC_ADM', 'Projet avance bien!', GETDATE(), 0),
('MSG_CIN001', 'CHAT_CIN001', 'CIN_ADM', 'Design accepte, on passe au developpement', GETDATE(), 0),
('MSG_SSO001', 'CHAT_SSO001', 'SSO_CHEF', 'Tests termines avec succes', GETDATE(), 0);

PRINT '6 ChatRooms, 17 membres, 5 messages inseres.';
GO

-- =====================================================
-- 11. NOTIFICATIONS
-- =====================================================

INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu, DateCreation) VALUES 
('NOT_TTS001', 'TTS_ADM', 'Nouvelle tache assignee', 'Nouvelle tache vous a ete assignee', 0, GETDATE()),
('NOT_TTS002', 'TTS_RH', 'Demande de conge', 'Nouvelle demande de conge en attente', 0, GETDATE()),
('NOT_TTS003', 'TTS_CHEF1', 'Projet mis a jour', 'Le projet a atteint 55% de progression', 0, GETDATE()),
('NOT_SDC001', 'SDC_ADM', 'Candidat poste', 'Nouveau candidat pour le poste', 0, GETDATE()),
('NOT_CIN001', 'CIN_CHEF', 'Tache terminee', 'La tache Module Stock est terminee', 0, GETDATE()),
('NOT_SSO001', 'SSO_RH', 'Employe ajoute', 'Nouveau employe ajoute a lequipe', 0, GETDATE()),
('NOT_NBD001', 'NBD_ADM', 'Avancee projet', 'Projet a atteint 60%', 0, GETDATE()),
('NOT_MST001', 'MST_RH', 'Evaluation', 'Evaluation mensuelle a completer', 0, GETDATE());

PRINT '8 Notifications inserees.';
GO

-- =====================================================
-- 12. CONTACTS
-- =====================================================

INSERT INTO Contacts (Id, SocieteId, Nom, Email, Telephone, Actif) VALUES 
('CON_TTS001', 'SOC001', 'Alpha Technology', 'alpha@client.tn', '21671110001', 1),
('CON_SDC001', 'SOC002', 'Beta Corp', 'beta@client.tn', '21674210001', 1),
('CON_CIN001', 'SOC003', 'Gamma Industries', 'gamma@client.tn', '21671810001', 1),
('CON_SSO001', 'SOC004', 'Delta Trading', 'delta@client.tn', '21673210001', 1),
('CON_NBD001', 'SOC005', 'Epsilon Services', 'epsilon@client.tn', '21672210001', 1);

PRINT '5 Contacts inseres.';
GO

-- =====================================================
-- 13. OFFRES D'EMPLOI
-- =====================================================

INSERT INTO OffresEmploi (Id, SocieteId, CreeParId, Titre, Description, TypeContrat, Lieu, Statut, DateCreation) VALUES 
('OFFRE_TTS001', 'SOC001', 'TTS_RH', 'Developpeur Full Stack', 'Recherche developpeur full stack experimenté', 'CDI', 'Tunis', 'Active', GETDATE()),
('OFFRE_TTS002', 'SOC001', 'TTS_RH', 'Designer UI/UX', 'Recherche designer UI/UX', 'CDI', 'Tunis', 'Active', GETDATE()),
('OFFRE_SDC001', 'SOC002', 'SDC_RH', 'Developpeur Mobile', 'Recherche developpeur mobile', 'CDD', 'Sfax', 'Active', GETDATE()),
('OFFRE_CIN001', 'SOC003', 'CIN_RH', 'Chef de Projet', 'Recherche chef de projet', 'CDI', 'Tunis', 'Active', GETDATE()),
('OFFRE_SSO001', 'SOC004', 'SSO_RH', 'Testeur QA', 'Recherche testeur QA', 'CDI', 'Sousse', 'Active', GETDATE());

PRINT '5 Offres emploi inserees.';
GO

-- =====================================================
-- 14. CANDIDATURES
-- =====================================================

INSERT INTO Candidatures (Id, OffreEmploiId, Nom, Prenom, Email, Telephone, CV, Statut, DateCandidature) VALUES 
('CAND_TTS001', 'OFFRE_TTS001', 'Ben Ali', 'Mohamed', 'mohamed.benali@email.tn', '21695100001', 'cv_mohamed.pdf', 'En cours', GETDATE()),
('CAND_TTS002', 'OFFRE_TTS001', 'Trabelsi', 'Sonia', 'sonia.trabelsi@email.tn', '21695100002', 'cv_sonia.pdf', 'En cours', GETDATE()),
('CAND_SDC001', 'OFFRE_SDC001', 'Kraiem', 'Yassine', 'yassine.kraiem@email.tn', '21694200001', 'cv_yassine.pdf', 'En cours', GETDATE()),
('CAND_CIN001', 'OFFRE_CIN001', 'Mansour', 'Leila', 'leila.mansour@email.tn', '21691800001', 'cv_leila.pdf', 'En cours', GETDATE()),
('CAND_SSO001', 'OFFRE_SSO001', 'Amara', 'Bilal', 'bilal.amara@email.tn', '21693200001', 'cv_bilal.pdf', 'Acceptee', GETDATE());

PRINT '5 Candidatures inserees.';
GO

-- =====================================================
-- RESUME
-- =====================================================

PRINT '';
PRINT '===============================================';
PRINT 'DONNEES TUNISIE INSEREES AVEC SUCCES!';
PRINT '===============================================';
PRINT '';
PRINT 'Societes: 8';
PRINT 'Types Utilisateur: 8';
PRINT 'Utilisateurs: 42';
PRINT 'Modules: 8';
PRINT 'Roles: 4';
PRINT 'Projets: 17';
PRINT 'Taches: 35';
PRINT 'Types Pointage: 5';
PRINT 'Demandes Conge: 9';
PRINT 'Abonnements: 8';
PRINT 'Paiements: 8';
PRINT 'ChatRooms: 6';
PRINT 'ChatRoomMembers: 17';
PRINT 'ChatMessages: 5';
PRINT 'Notifications: 8';
PRINT 'Contacts: 5';
PRINT 'Offres Emploi: 5';
PRINT 'Candidatures: 5';
PRINT '';
PRINT 'Total: ~150 enregistrements';
PRINT '';
GO