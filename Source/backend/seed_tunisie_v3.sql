-- =====================================================
-- NADHEMNI - Script Clear & Seed Donnees Tunisie v3
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
DELETE FROM Attachement;
DELETE FROM SousTache;
DELETE FROM TacheAssignation;
DELETE FROM ProjetUtilisateur;
DELETE FROM Tache;
DELETE FROM Projet;

DELETE FROM Permission;
DELETE FROM Role;
DELETE FROM Module;
DELETE FROM Utilisateur;
DELETE FROM TypeUtilisateur;
DELETE FROM Societe;

PRINT 'Toutes les donnees supprimees.';
GO

-- =====================================================
-- 1. SOCIETES TUNISIENNES
-- =====================================================

INSERT INTO Societe (Id, Nom, Adresse, TelephoneContact, Email, Ville, PlanAbonnement, Actif) VALUES 
('SOC001', 'Tunisia Tech Solutions', 'Avenue Habib Bourguiba, Tunis', '+216 71 100 000', 'contact@tunisiatech.tn', 'Tunis', 'Premium', 1),
('SOC002', 'Sfax Digital Center', 'Rue Ibn Khaldoun, Sfax', '+216 74 200 000', 'contact@sfaxdigital.tn', 'Sfax', 'Basic', 1),
('SOC003', 'Carthage Innovation', 'Boulevard du 14 Janvier, Tunis', '+216 71 800 000', 'contact@carthageinnovation.tn', 'Tunis', 'Standard', 1),
('SOC004', 'Sousse Software', 'Avenue 7 Novembre, Sousse', '+216 73 200 000', 'contact@soussesoft.tn', 'Sousse', 'Premium', 1),
('SOC005', 'Nabeul Dev', 'Rue de la Liberation, Nabeul', '+216 72 200 000', 'contact@nabeuldev.tn', 'Nabeul', 'Basic', 1),
('SOC006', 'Monastir Systems', 'Avenue de la Republique, Monastir', '+216 73 500 000', 'contact@monastirsys.tn', 'Monastir', 'Standard', 1),
('SOC007', 'Kairouan IT', 'Avenue Al-Azhar, Kairouan', '+216 77 100 000', 'contact@kairouanit.tn', 'Kairouan', 'Basic', 1),
('SOC008', 'Gabes Energy Tech', 'Route de Medenine, Gabes', '+216 75 300 000', 'contact@gabestech.tn', 'Gabes', 'Premium', 1);

PRINT '8 Societes inserees.';
GO

-- =====================================================
-- 2. TYPES D'UTILISATEURS
-- =====================================================

INSERT INTO TypeUtilisateur (Id, Nom, Description, Actif) VALUES 
('T001', 'Super Administrateur', 'Administrateur de la plateforme', 1),
('T002', 'Admin Societe', 'Administrateur de la societe', 1),
('T003', 'RH', 'Responsable des ressources humaines', 1),
('T004', 'Chef de Projet', 'Chef de projet', 1),
('T005', 'Developpeur', 'Developpeur', 1),
('T006', 'Testeur', 'Testeur QA', 1),
('T007', 'Designer', 'Designer UI/UX', 1);

PRINT '7 Types utilisateur inseres.';
GO

-- =====================================================
-- 3. UTILISATEURS PAR SOCIETE
-- =====================================================

-- Tunisia Tech Solutions (SOC001)
INSERT INTO Utilisateur (Id, Nom, Email, MotDePasse, TypeUtilisateurId, SocieteId, Actif) VALUES 
('USR_TTS001', 'Ahmed Ben Ali', 'admin@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC001', 1),
('USR_TTS002', 'Fatma Kraiem', 'rh@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC001', 1),
('USR_TTS003', 'Slaheddine Mansour', 'chef@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC001', 1),
('USR_TTS004', 'Leila Mseddi', 'dev1@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC001', 1),
('USR_TTS005', 'Karim Bouazizi', 'dev2@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC001', 1),
('USR_TTS006', 'Malek Amara', 'dev3@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC001', 1),
('USR_TTS007', 'Youssef Ghanmi', 'test@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T006', 'SOC001', 1),
('USR_TTS008', 'Nour Ben Hamida', 'des@tunisiatech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T007', 'SOC001', 1),

-- Sfax Digital Center (SOC002)
('USR_SDC001', 'Imed Chaabane', 'admin@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC002', 1),
('USR_SDC002', 'Hichem Ben Ammar', 'rh@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC002', 1),
('USR_SDC003', 'Mehdi Khelifi', 'chef@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC002', 1),
('USR_SDC004', 'Tarek Lassoued', 'dev1@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC002', 1),
('USR_SDC005', 'Bilal Graa', 'dev2@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC002', 1),
('USR_SDC006', 'Hajer Charfi', 'test@sfaxdigital.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T006', 'SOC002', 1),

-- Carthage Innovation (SOC003)
('USR_CIN001', 'Rafik Ben Salem', 'admin@carthageinnovation.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC003', 1),
('USR_CIN002', 'Lotfi Melliti', 'rh@carthageinnovation.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC003', 1),
('USR_CIN003', 'Sami Benhassen', 'chef@carthageinnovation.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC003', 1),
('USR_CIN004', 'Nadia Hamdi', 'dev1@carthageinnovation.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC003', 1),
('USR_CIN005', 'Omar Sassi', 'dev2@carthageinnovation.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC003', 1),

-- Sousse Software (SOC004)
('USR_SSO001', 'Yassine Mbarek', 'admin@sousesoft.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC004', 1),
('USR_SSO002', 'Amira Bettaieb', 'rh@sousesoft.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC004', 1),
('USR_SSO003', 'Abdelkader Cherif', 'chef@sousesoft.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC004', 1),
('USR_SSO004', 'Mariem Ayed', 'dev1@sousesoft.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC004', 1),
('USR_SSO005', 'Anis Rezgui', 'dev2@sousesoft.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC004', 1),

-- Nabeul Dev (SOC005)
('USR_NBD001', 'Fares Sassi', 'admin@nabeuldev.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC005', 1),
('USR_NBD002', 'Walid Boughanmi', 'chef@nabeuldev.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC005', 1),
('USR_NBD003', 'Ameni Jarray', 'dev@nabeuldev.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC005', 1),

-- Monastir Systems (SOC006)
('USR_MST001', 'Sahbi Bouafia', 'admin@monastirsys.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC006', 1),
('USR_MST002', 'Mouna Ben Ali', 'rh@monastirsys.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC006', 1),
('USR_MST003', 'Hatem Kouki', 'chef@monastirsys.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC006', 1),
('USR_MST004', 'Aya Slama', 'dev1@monastirsys.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC006', 1),
('USR_MST005', 'Mehdi Rahal', 'dev2@monastirsys.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC006', 1),

-- Kairouan IT (SOC007)
('USR_KIT001', 'Jamel Chouchane', 'admin@kairouanit.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC007', 1),
('USR_KIT002', 'Bilel Mahjoub', 'chef@kairouanit.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC007', 1),
('USR_KIT003', 'Ikbel Benali', 'dev@kairouanit.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC007', 1),

-- Gabes Energy Tech (SOC008)
('USR_GET001', 'Riadh Dridi', 'admin@gabestech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T002', 'SOC008', 1),
('USR_GET002', 'Sinda Ben Younes', 'rh@gabestech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T003', 'SOC008', 1),
('USR_GET003', 'Hichem Mekki', 'chef@gabestech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T004', 'SOC008', 1),
('USR_GET004', 'Nader Abdelkafi', 'dev1@gabestech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC008', 1),
('USR_GET005', 'Donia Haddad', 'dev2@gabestech.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T005', 'SOC008', 1),

-- Super Administrateur
('USR_SUPER', 'Admin NADHEMNI', 'super@nademhni.tn', '$2a$11$kHloJ9hsWKFmMceePkzN5.S8Rdn5EAbs8l0IS5hGGgHMePWEcAOMi', 'T001', NULL, 1);

PRINT '42 Utilisateurs inseres.';
GO

-- =====================================================
-- 4. MODULES ET ROLES
-- =====================================================

INSERT INTO Module (Id, Nom, Actif) VALUES 
('MOD001', 'Dashboard', 1),
('MOD002', 'Projets', 1),
('MOD003', 'Taches', 1),
('MOD004', 'Equipes', 1),
('MOD005', 'RH', 1),
('MOD006', 'Chat', 1),
('MOD007', 'Parametres', 1),
('MOD008', 'Rapports', 1);

INSERT INTO Role (Id, Nom, Actif) VALUES 
('ROL001', 'Admin', 1),
('ROL002', 'Chef', 1),
('ROL003', 'Membre', 1),
('ROL004', 'Invite', 1);

PRINT '8 Modules et 4 Roles inseres.';
GO

-- =====================================================
-- 5. PERMISSIONS
-- =====================================================

INSERT INTO Permission (RoleId, ModuleId, PeutLire, PeutCreer, PeutModifier, PeutSupprimer, Actif) VALUES 
('ROL001', 'MOD001', 1, 1, 1, 1, 1),
('ROL001', 'MOD002', 1, 1, 1, 1, 1),
('ROL001', 'MOD003', 1, 1, 1, 1, 1),
('ROL001', 'MOD004', 1, 1, 1, 1, 1),
('ROL001', 'MOD005', 1, 1, 1, 1, 1),
('ROL001', 'MOD006', 1, 1, 1, 1, 1),
('ROL001', 'MOD007', 1, 1, 1, 1, 1),
('ROL001', 'MOD008', 1, 1, 1, 1, 1),
('ROL002', 'MOD001', 1, 0, 0, 0, 1),
('ROL002', 'MOD002', 1, 1, 1, 1, 1),
('ROL002', 'MOD003', 1, 1, 1, 1, 1),
('ROL002', 'MOD004', 1, 1, 0, 0, 1),
('ROL003', 'MOD001', 1, 0, 0, 0, 1),
('ROL003', 'MOD002', 1, 0, 0, 0, 1),
('ROL003', 'MOD003', 1, 1, 0, 0, 1);

PRINT '15 Permissions inserees.';
GO

-- =====================================================
-- 6. PROJETS PAR SOCIETE
-- =====================================================

-- Tunisia Tech Solutions (SOC001)
INSERT INTO Projet (Id, Nom, Description, StartDate, EndDate, Status, Priorite, UtilisateurId, Actif) VALUES 
('PRJ_TTS001', 'Plateforme E-Learning', 'Developpement plateforme formation en ligne', '2026-01-01', '2026-06-30', 'En cours', 'High', 'USR_TTS003', 1),
('PRJ_TTS002', 'Application Mobile Banking', 'Application mobile pour banking', '2026-02-01', '2026-07-31', 'En cours', 'High', 'USR_TTS003', 1),
('PRJ_TTS003', 'Systeme de Gestion RH', 'Logiciel gestion ressources humaines', '2026-03-01', '2026-08-31', 'En cours', 'Medium', 'USR_TTS003', 1),
('PRJ_TTS004', 'Dashboard Analytics', 'Tableau de bord analytique', '2026-07-01', '2026-12-31', 'En attente', 'Medium', 'USR_TTS003', 1),

-- Sfax Digital Center (SOC002)
('PRJ_SDC001', 'Site Web Corporate', 'Refonte site web institutionnel', '2026-01-15', '2026-05-15', 'En cours', 'High', 'USR_SDC003', 1),
('PRJ_SDC002', 'Plateforme E-commerce', 'Plateforme e-commerce complete', '2026-03-01', '2026-08-31', 'En cours', 'High', 'USR_SDC003', 1),
('PRJ_SDC003', 'Application Mobile', 'Application mobile pour clients', '2025-01-01', '2025-03-31', 'Termine', 'Medium', 'USR_SDC003', 1),

-- Carthage Innovation (SOC003)
('PRJ_CIN001', 'ERP System', 'Systeme ERP complet', '2026-01-01', '2026-06-30', 'En cours', 'High', 'USR_CIN003', 1),
('PRJ_CIN002', 'CRM Solution', 'Solution gestion clients', '2026-02-15', '2026-07-31', 'En cours', 'Medium', 'USR_CIN003', 1),

-- Sousse Software (SOC004)
('PRJ_SSO001', 'Gestion Stock', 'Systeme de gestion de stock', '2026-01-01', '2026-04-30', 'En cours', 'High', 'USR_SSO003', 1),
('PRJ_SSO002', 'Point de Vente', 'Systeme POS', '2026-04-01', '2026-09-30', 'En cours', 'Medium', 'USR_SSO003', 1),

-- Nabeul Dev (SOC005)
('PRJ_NBD001', 'Application Livraison', 'Application de livraison', '2026-01-01', '2026-05-31', 'En cours', 'High', 'USR_NBD002', 1),

-- Monastir Systems (SOC006)
('PRJ_MST001', 'Platforme EduTech', 'Plateforme education', '2026-01-01', '2026-06-30', 'En cours', 'High', 'USR_MST003', 1),
('PRJ_MST002', 'Application Sport', 'Application gestion sport', '2026-04-01', '2026-09-30', 'En cours', 'Medium', 'USR_MST003', 1),

-- Kairouan IT (SOC007)
('PRJ_KIT001', 'Site Web', 'Site web institutionnel', '2026-01-01', '2026-04-30', 'En cours', 'High', 'USR_KIT002', 1),

-- Gabes Energy Tech (SOC008)
('PRJ_GET001', 'Systeme Gestion', 'Systeme de gestion', '2026-01-15', '2026-06-15', 'En cours', 'High', 'USR_GET003', 1),
('PRJ_GET002', 'Application Mobile', 'Application mobile', '2026-03-01', '2026-08-31', 'En cours', 'Medium', 'USR_GET003', 1);

PRINT '17 Projets inseres.';
GO

-- =====================================================
-- 7. TACHES PAR PROJET
-- =====================================================

INSERT INTO Tache (Id, ProjetId, Titre, Description, Statut, Priorite, DateLimite, Actif) VALUES 
-- Taches pour Plateforme E-Learning (PRJ_TTS001)
('TACHE_TTS001', 'PRJ_TTS001', 'Analyse fonctionnelle', 'Redaction des specifications fonctionnelles', 'Termine', 'High', '2026-01-31', 1),
('TACHE_TTS002', 'PRJ_TTS001', 'Design UI/UX', 'Creation mockups et design interface', 'Termine', 'High', '2026-02-15', 1),
('TACHE_TTS003', 'PRJ_TTS001', 'Implementation Authentification', 'Developpement module authentification OAuth', 'En cours', 'High', '2026-03-01', 1),
('TACHE_TTS004', 'PRJ_TTS001', 'Module Video Streaming', 'Developpement module video en streaming', 'En cours', 'High', '2026-03-15', 1),
('TACHE_TTS005', 'PRJ_TTS001', 'Integration Paiement', 'Integration systeme de paiement', 'A faire', 'Medium', '2026-04-01', 1),
('TACHE_TTS006', 'PRJ_TTS001', 'Tests Unitaires', 'Ecriture tests unitaires', 'A faire', 'Medium', '2026-04-15', 1),

-- Taches pour Application Mobile Banking (PRJ_TTS002)
('TACHE_TTS007', 'PRJ_TTS002', 'Architecture Microservices', 'Conception architecture microservices', 'En cours', 'High', '2026-03-01', 1),
('TACHE_TTS008', 'PRJ_TTS002', 'API Comptes', 'Developpement API gestion comptes', 'En cours', 'High', '2026-03-15', 1),
('TACHE_TTS009', 'PRJ_TTS002', 'Module Virement', 'Developpement module virement', 'A faire', 'Medium', '2026-04-01', 1),
('TACHE_TTS010', 'PRJ_TTS002', 'Notifications', 'Systeme de notifications', 'A faire', 'Medium', '2026-04-15', 1),

-- Taches pour Site Web Corporate (PRJ_SDC001)
('TACHE_SDC001', 'PRJ_SDC001', 'Design Homepage', 'Creation design page daccueil', 'Termine', 'Medium', '2026-02-15', 1),
('TACHE_SDC002', 'PRJ_SDC001', 'Integration CMS', 'Integration systeme de gestion de contenu', 'En cours', 'High', '2026-03-01', 1),
('TACHE_SDC003', 'PRJ_SDC001', 'SEO Optimisation', 'Optimisation SEO', 'En cours', 'Medium', '2026-04-01', 1),

-- Taches pour ERP System (PRJ_CIN001)
('TACHE_CIN001', 'PRJ_CIN001', 'Module Stock', 'Developpement module gestion stock', 'Termine', 'High', '2026-01-31', 1),
('TACHE_CIN002', 'PRJ_CIN001', 'Module Comptabilite', 'Developpement module comptabilite', 'En cours', 'High', '2026-03-01', 1),
('TACHE_CIN003', 'PRJ_CIN001', 'Module RH', 'Developpement module RH', 'A faire', 'High', '2026-04-01', 1),
('TACHE_CIN004', 'PRJ_CIN001', 'Rapports', 'Generation des rapports', 'A faire', 'Medium', '2026-04-15', 1),

-- Taches pour Gestion Stock (PRJ_SSO001)
('TACHE_SSO001', 'PRJ_SSO001', 'Analyse Requirements', 'Redaction des requirements', 'Termine', 'High', '2026-01-15', 1),
('TACHE_SSO002', 'PRJ_SSO001', 'Developpement Core', 'Developpement du core applicatif', 'Termine', 'High', '2026-02-15', 1),
('TACHE_SSO003', 'PRJ_SSO001', 'Integration Code Barre', 'Integration lecteur code barre', 'En cours', 'Medium', '2026-03-15', 1),
('TACHE_SSO004', 'PRJ_SSO001', 'Tests', 'Phase de tests', 'A faire', 'Medium', '2026-04-01', 1),

-- Taches pour Application Livraison (PRJ_NBD001)
('TACHE_NBD001', 'PRJ_NBD001', 'Design App', 'Design application mobile', 'Termine', 'High', '2026-01-31', 1),
('TACHE_NBD002', 'PRJ_NBD001', 'API Backend', 'Developpement API backend', 'En cours', 'High', '2026-03-01', 1),
('TACHE_NBD003', 'PRJ_NBD001', 'Geolocalisation', 'Module geolocalisation', 'En cours', 'High', '2026-04-01', 1),
('TACHE_NBD004', 'PRJ_NBD001', 'Suivi Livraisons', 'Module suivi livraisons', 'A faire', 'Medium', '2026-05-01', 1),

-- Taches pour Platforme EduTech (PRJ_MST001)
('TACHE_MST001', 'PRJ_MST001', 'Conception Architecture', 'Architecture de la plateforme', 'Termine', 'High', '2026-01-31', 1),
('TACHE_MST002', 'PRJ_MST001', 'Module Cours', 'Developpement module cours', 'En cours', 'High', '2026-03-15', 1),
('TACHE_MST003', 'PRJ_MST001', 'Module Quiz', 'Developpement module quiz et evalutions', 'A faire', 'Medium', '2026-04-15', 1),

-- Taches pour Site Web (PRJ_KIT001)
('TACHE_KIT001', 'PRJ_KIT001', 'Mockups Design', 'Creation des mockups', 'Termine', 'High', '2026-01-15', 1),
('TACHE_KIT002', 'PRJ_KIT001', 'Developpement Frontend', 'Developpement frontend', 'En cours', 'High', '2026-02-15', 1),
('TACHE_KIT003', 'PRJ_KIT001', 'Developpement Backend', 'Developpement backend', 'En cours', 'High', '2026-03-15', 1),
('TACHE_KIT004', 'PRJ_KIT001', 'Tests et Validation', 'Tests et validation', 'Termine', 'Medium', '2026-04-15', 1),

-- Taches pour Systeme Gestion (PRJ_GET001)
('TACHE_GET001', 'PRJ_GET001', 'Analyse', 'Analyse du projet', 'Termine', 'High', '2026-01-30', 1),
('TACHE_GET002', 'PRJ_GET001', 'Developpement', 'Developpement application', 'En cours', 'High', '2026-03-15', 1),
('TACHE_GET003', 'PRJ_GET001', 'Rapports', 'Module rapports', 'A faire', 'Medium', '2026-04-15', 1);

PRINT '35 Taches inserees.';
GO

-- =====================================================
-- 8. DEMANDES DE CONGE
-- =====================================================

INSERT INTO Type (Id, Nom, Actif) VALUES 
('TP001', 'Conge Paye', 1),
('TP002', 'Conge Maladie', 1),
('TP003', 'Conge Sans Solde', 1),
('TP004', 'Permission', 1);

INSERT INTO DemandesConge (Id, UtilisateurId, TypePointageId, DateDebut, DateFin, Status, Motif, ValideParId) VALUES 
('CNG_TTS001', 'USR_TTS004', 'TP001', '2026-05-15', '2026-05-20', 'En_attente', 'Vacances printemps', 'USR_TTS002'),
('CNG_TTS002', 'USR_TTS005', 'TP002', '2026-04-10', '2026-04-12', 'Approuve', 'Rendez-vous medical', 'USR_TTS002'),
('CNG_TTS003', 'USR_TTS007', 'TP001', '2026-05-01', '2026-05-05', 'En_attente', 'Voyage familial', 'USR_TTS002'),
('CNG_SDC001', 'USR_SDC004', 'TP001', '2026-04-20', '2026-04-25', 'En_attente', 'Evenement familial', 'USR_SDC002'),
('CNG_SDC002', 'USR_SDC005', 'TP004', '2026-04-15', '2026-04-15', 'Approuve', 'Rendez-vous administratif', 'USR_SDC002'),
('CNG_CIN001', 'USR_CIN004', 'TP001', '2026-05-10', '2026-05-15', 'En_attente', 'Vacances ete', 'USR_CIN002'),
('CNG_SSO001', 'USR_SSO004', 'TP001', '2026-05-20', '2026-05-25', 'En_attente', 'Vacances', 'USR_SSO002'),
('CNG_MST001', 'USR_MST004', 'TP002', '2026-04-08', '2026-04-10', 'Approuve', 'Conge medicale', 'USR_MST002'),
('CNG_GET001', 'USR_GET004', 'TP001', '2026-05-05', '2026-05-10', 'En_attente', 'Voyage', 'USR_GET002');

PRINT '4 Types Pointage et 9 Demandes conge inserees.';
GO

-- =====================================================
-- 9. ABONNEMENTS ET PAIEMENTS
-- =====================================================

INSERT INTO Abonnements (Id, SocieteId, TypeAbonnement, DateDebut, DateFin, Actif) VALUES 
('ABO_TTS001', 'SOC001', 'Premium', '2026-01-01', '2026-12-31', 1),
('ABO_SDC001', 'SOC002', 'Basic', '2026-01-01', '2026-06-30', 1),
('ABO_CIN001', 'SOC003', 'Standard', '2026-01-01', '2026-06-30', 1),
('ABO_SSO001', 'SOC004', 'Premium', '2026-01-01', '2026-12-31', 1),
('ABO_NBD001', 'SOC005', 'Basic', '2026-01-01', '2026-06-30', 1),
('ABO_MST001', 'SOC006', 'Standard', '2026-01-01', '2026-06-30', 1),
('ABO_KIT001', 'SOC007', 'Basic', '2026-01-01', '2026-03-31', 1),
('ABO_GET001', 'SOC008', 'Premium', '2026-01-01', '2026-12-31', 1);

INSERT INTO Paiements (Id, SocieteId, SocieteNom, Description, Montant, Date, Statut, Type) VALUES 
('PAY_TTS001', 'SOC001', 'Tunisia Tech Solutions', 'Abonnement Premium Annuel', 2400.00, '2026-01-05', 'Valide', 'Virement'),
('PAY_SDC001', 'SOC002', 'Sfax Digital Center', 'Abonnement Basic 6 mois', 600.00, '2026-01-10', 'Valide', 'Carte'),
('PAY_CIN001', 'SOC003', 'Carthage Innovation', 'Abonnement Standard 6 mois', 1200.00, '2026-01-15', 'En attente', 'Virement'),
('PAY_SSO001', 'SOC004', 'Sousse Software', 'Abonnement Premium Annuel', 2400.00, '2026-01-20', 'Valide', 'Virement'),
('PAY_NBD001', 'SOC005', 'Nabeul Dev', 'Abonnement Basic 6 mois', 600.00, '2026-01-25', 'Valide', 'Carte'),
('PAY_MST001', 'SOC006', 'Monastir Systems', 'Abonnement Standard 6 mois', 1200.00, '2026-02-01', 'Valide', 'Virement'),
('PAY_KIT001', 'SOC007', 'Kairouan IT', 'Abonnement Basic 3 mois', 300.00, '2026-02-05', 'Valide', 'Carte'),
('PAY_GET001', 'SOC008', 'Gabes Energy Tech', 'Abonnement Premium Annuel', 2400.00, '2026-02-10', 'Valide', 'Virement');

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
('CRM_TTS001', 'CHAT_TTS001', 'USR_TTS001'),
('CRM_TTS002', 'CHAT_TTS001', 'USR_TTS002'),
('CRM_TTS003', 'CHAT_TTS001', 'USR_TTS003'),
('CRM_TTS004', 'CHAT_TTS001', 'USR_TTS004'),
('CRM_TTS005', 'CHAT_TTS002', 'USR_TTS004'),
('CRM_TTS006', 'CHAT_TTS002', 'USR_TTS005'),
('CRM_TTS007', 'CHAT_TTS002', 'USR_TTS006'),
('CRM_SDC001', 'CHAT_SDC001', 'USR_SDC001'),
('CRM_SDC002', 'CHAT_SDC001', 'USR_SDC003'),
('CRM_SDC003', 'CHAT_SDC001', 'USR_SDC004'),
('CRM_CIN001', 'CHAT_CIN001', 'USR_CIN001'),
('CRM_CIN002', 'CHAT_CIN001', 'USR_CIN003'),
('CRM_CIN003', 'CHAT_CIN001', 'USR_CIN004'),
('CRM_SSO001', 'CHAT_SSO001', 'USR_SSO001'),
('CRM_SSO002', 'CHAT_SSO001', 'USR_SSO003'),
('CRM_NBD001', 'CHAT_NBD001', 'USR_NBD001'),
('CRM_NBD002', 'CHAT_NBD001', 'USR_NBD002');

INSERT INTO ChatMessages (Id, ChatRoomId, ExpediteurId, Message, EstLu) VALUES 
('MSG_TTS001', 'CHAT_TTS001', 'USR_TTS001', 'Bienvenue sur le chat de Tunisia Tech!', 0),
('MSG_TTS002', 'CHAT_TTS001', 'USR_TTS003', 'Noubliez pas la reunion demain a 10h', 0),
('MSG_SDC001', 'CHAT_SDC001', 'USR_SDC001', 'Projet avance bien!', 0),
('MSG_CIN001', 'CHAT_CIN001', 'USR_CIN001', 'Design accepte, on passe au developpement', 0),
('MSG_SSO001', 'CHAT_SSO001', 'USR_SSO003', 'Tests termines avec succes', 0);

PRINT '6 ChatRooms, 17 membres, 5 messages inseres.';
GO

-- =====================================================
-- 11. NOTIFICATIONS
-- =====================================================

INSERT INTO Notifications (Id, UtilisateurId, Titre, Contenu, EstLu) VALUES 
('NOT_TTS001', 'USR_TTS001', 'Nouvelle tache assignee', 'Nouvelle tache vous a ete assignee', 0),
('NOT_TTS002', 'USR_TTS002', 'Demande de conge', 'Nouvelle demande de conge en attente', 0),
('NOT_TTS003', 'USR_TTS003', 'Projet mis a jour', 'Le projet a atteint 55% de progression', 0),
('NOT_SDC001', 'USR_SDC001', 'Candidat poste', 'Nouveau candidat pour le poste', 0),
('NOT_CIN001', 'USR_CIN003', 'Tache terminee', 'La tache Module Stock est terminee', 0),
('NOT_SSO001', 'USR_SSO002', 'Employe ajoute', 'Nouveau employe ajoute a lequipe', 0),
('NOT_NBD001', 'USR_NBD001', 'Avancee projet', 'Projet a atteint 60%', 0),
('NOT_MST001', 'USR_MST002', 'Evaluation', 'Evaluation mensuelle a completer', 0);

PRINT '8 Notifications inserees.';
GO

-- =====================================================
-- 12. CONTACTS
-- =====================================================

INSERT INTO Contacts (Id, SocieteId, Nom, Email, Telephone, Actif) VALUES 
('CON_TTS001', 'SOC001', 'Alpha Technology', 'alpha@client.tn', '+216 71 110 001', 1),
('CON_SDC001', 'SOC002', 'Beta Corp', 'beta@client.tn', '+216 74 210 001', 1),
('CON_CIN001', 'SOC003', 'Gamma Industries', 'gamma@client.tn', '+216 71 810 001', 1),
('CON_SSO001', 'SOC004', 'Delta Trading', 'delta@client.tn', '+216 73 210 001', 1),
('CON_NBD001', 'SOC005', 'Epsilon Services', 'epsilon@client.tn', '+216 72 210 001', 1);

PRINT '5 Contacts inseres.';
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
PRINT 'Types Utilisateur: 7';
PRINT 'Utilisateurs: 42';
PRINT 'Modules: 8';
PRINT 'Roles: 4';
PRINT 'Permissions: 15';
PRINT 'Projets: 17';
PRINT 'Taches: 35';
PRINT 'Demandes Conge: 9';
PRINT 'Abonnements: 8';
PRINT 'Paiements: 8';
PRINT 'ChatRooms: 6';
PRINT 'ChatRoomMembers: 17';
PRINT 'ChatMessages: 5';
PRINT 'Notifications: 8';
PRINT 'Contacts: 5';
PRINT '';
PRINT 'Total: ~175 enregistrements';
PRINT '';
GO