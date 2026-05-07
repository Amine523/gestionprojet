-- Script de seeding: 2 Sociétés tunisiennes et utilisateurs associés
-- Date: 2026-05-04
-- 
-- NOTE: Les mots de passe doivent être hashés avec BCrypt.
-- Exécutez ce script C# pour générer les hashes, ou utilisez l'API pour créer les utilisateurs.
-- 
-- using BCrypt.Net;
-- Console.WriteLine(BCrypt.HashPassword("SoftPro"));
-- Console.WriteLine(BCrypt.HashPassword("TunisieTech"));

-- Vérifier si les sociétés existent déjà avant insertion
IF NOT EXISTS (SELECT 1 FROM dbo.SocieteCore WHERE Id = 'SP001')
BEGIN
    -- Société 1: SoftPro (Tunisie)
    INSERT INTO dbo.SocieteCore (Id, Nom, Adresse, TelephoneContact, Email, CodePostale, Ville, Pays, PersonneContact, SiteWeb, Actif)
    VALUES ('SP001', 'SoftPro', '123 Avenue Habib Bourguiba, Tunis, Tunisie', '+216 71 000 000', 'contact@softpro.com', '1000', 'Tunis', 'Tunisie', 'Mohamed Ben Salah', 'https://softpro.tn', 1);
END

IF NOT EXISTS (SELECT 1 FROM dbo.SocieteCore WHERE Id = 'SP002')
BEGIN
    -- Société 2: TunisieTech (Tunisie)
    INSERT INTO dbo.SocieteCore (Id, Nom, Adresse, TelephoneContact, Email, CodePostale, Ville, Pays, PersonneContact, SiteWeb, Actif)
    VALUES ('SP002', 'TunisieTech', '45 Rue du Lac, Les Berges du Lac, Tunis, Tunisie', '+216 71 000 001', 'contact@tunisietch.com', '1053', 'Tunis', 'Tunisie', 'Fatma Trabelsi', 'https://tunisietch.com', 1);
END

GO

-- Vérifier si les types utilisateurs existent
IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T001')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T001', 'Administrateur', 'Type utilisateur Administrateur', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T002')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T002', 'Admin Société', 'Type utilisateur Admin Société', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T003')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T003', 'RH', 'Type utilisateur RH', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T004')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T004', 'Chef Projet', 'Type utilisateur Chef Projet', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T005')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T005', 'Développeur', 'Type utilisateur Développeur', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T006')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T006', 'Testeur', 'Type utilisateur Testeur', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TypeUtilisateurCore WHERE Id = 'T007')
    INSERT INTO dbo.TypeUtilisateurCore (Id, Nom, Description, Actif) VALUES ('T007', 'Utilisateur', 'Type utilisateur standard', 1);

GO

-- Utilisateurs SoftPro (SP001)
-- Mot de passe: SoftPro (à hasher avec BCrypt avant insertion)
IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'admin@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U1', 'AdminGlobal', 'admin@softpro.com', '<BCRYPT_HASH>', '', 'T001', 'SP001', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'adminS@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U2', 'AdminSociete', 'adminS@softpro.com', '<BCRYPT_HASH>', '', 'T002', 'SP001', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'chef@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U3', 'ChefProjet', 'chef@softpro.com', '<BCRYPT_HASH>', '', 'T004', 'SP001', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'dev1@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U4', 'Dev1', 'dev1@softpro.com', '<BCRYPT_HASH>', '', 'T005', 'SP001', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'rh@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U5', 'RH1', 'rh@softpro.com', '<BCRYPT_HASH>', '', 'T003', 'SP001', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'qa@softpro.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U6', 'Tester1', 'qa@softpro.com', '<BCRYPT_HASH>', '', 'T006', 'SP001', '', 1);

-- Utilisateurs TunisieTech (SP002)
-- Mot de passe: TunisieTech (à hasher avec BCrypt avant insertion)
IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'admin@tunisietch.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U7', 'AdminTunisieTech', 'admin@tunisietch.com', '<BCRYPT_HASH>', '', 'T002', 'SP002', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'chef2@tunisietch.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U8', 'ChefProjet2', 'chef2@tunisietch.com', '<BCRYPT_HASH>', '', 'T004', 'SP002', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'dev@tunisietch.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U9', 'DevTunisieTech', 'dev@tunisietch.com', '<BCRYPT_HASH>', '', 'T005', 'SP002', '', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.UtilisateurCore WHERE Email = 'rh@tunisietch.com')
    INSERT INTO dbo.UtilisateurCore (Id, Nom, Email, MotDePasse, CV, TypeUtilisateurId, SocieteId, RoleId, Actif)
    VALUES ('U10', 'RHTunisieTech', 'rh@tunisietch.com', '<BCRYPT_HASH>', '', 'T003', 'SP002', '', 1);

GO

-- Projets
IF NOT EXISTS (SELECT 1 FROM dbo.ProjetCore WHERE Id = 'PRJ001')
    INSERT INTO dbo.ProjetCore (Id, Nom, Description, StartDate, EndDate, Status, Priorite, UtilisateurId, Actif)
    VALUES ('PRJ001', 'Migration Cloud', 'Migration de l''infrastructure vers AWS', GETDATE(), DATEADD(MONTH, 3, GETDATE()), 'En cours', 'Haute', 'U3', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.ProjetCore WHERE Id = 'PRJ002')
    INSERT INTO dbo.ProjetCore (Id, Nom, Description, StartDate, EndDate, Status, Priorite, UtilisateurId, Actif)
    VALUES ('PRJ002', 'Refonte UI/UX', 'Nouveau design pour le portail client', DATEADD(DAY, -10, GETDATE()), DATEADD(MONTH, 1, GETDATE()), 'En attente', 'Moyenne', 'U3', 1);

IF NOT EXISTS (SELECT 1 FROM dbo.ProjetCore WHERE Id = 'PRJ003')
    INSERT INTO dbo.ProjetCore (Id, Nom, Description, StartDate, EndDate, Status, Priorite, UtilisateurId, Actif)
    VALUES ('PRJ003', 'Développement Mobile', 'Application mobile pour la gestion de projet', GETDATE(), DATEADD(MONTH, 2, GETDATE()), 'En cours', 'Haute', 'U8', 1);

GO

-- Tâches
IF NOT EXISTS (SELECT 1 FROM dbo.TacheCore WHERE Id = 'TSK001')
    INSERT INTO dbo.TacheCore (Id, ProjetId, Titre, Description, Priorite, Statut, DateLimite, Actif)
    VALUES ('TSK001', 'PRJ001', 'Configuration VPC', 'Mise en place du réseau virtuel', 'Haute', 'To Do', DATEADD(DAY, 5, GETDATE()), 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TacheCore WHERE Id = 'TSK002')
    INSERT INTO dbo.TacheCore (Id, ProjetId, Titre, Description, Priorite, Statut, DateLimite, Actif)
    VALUES ('TSK002', 'PRJ001', 'Setup EC2', 'Provisionnement des instances', 'Moyenne', 'In Progress', DATEADD(DAY, 7, GETDATE()), 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TacheCore WHERE Id = 'TSK003')
    INSERT INTO dbo.TacheCore (Id, ProjetId, Titre, Description, Priorite, Statut, DateLimite, Actif)
    VALUES ('TSK003', 'PRJ002', 'Maquettes Figma', 'Design des pages principales', 'Haute', 'Done', DATEADD(DAY, -1, GETDATE()), 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TacheCore WHERE Id = 'TSK004')
    INSERT INTO dbo.TacheCore (Id, ProjetId, Titre, Description, Priorite, Statut, DateLimite, Actif)
    VALUES ('TSK004', 'PRJ003', 'API REST', 'Développement des endpoints backend', 'Haute', 'To Do', DATEADD(DAY, 10, GETDATE()), 1);

IF NOT EXISTS (SELECT 1 FROM dbo.TacheCore WHERE Id = 'TSK005')
    INSERT INTO dbo.TacheCore (Id, ProjetId, Titre, Description, Priorite, Statut, DateLimite, Actif)
    VALUES ('TSK005', 'PRJ003', 'Interface React Native', 'Écran de connexion mobile', 'Moyenne', 'In Progress', DATEADD(DAY, 5, GETDATE()), 1);

GO

PRINT 'Seeding terminé: 2 sociétés tunisiennes, 10 utilisateurs, 3 projets, 5 tâches';