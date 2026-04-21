/*
================================================================================
MODULE 9: TESTS & SCORING - COMPLET
================================================================================
Tables pour recrutement et évaluation:
- Tests: Tests de recrutement (QCM, Technique, Mixte)
- Questions: Questions avec plusieurs types
- Reponses: Réponses (QCM avec choix multiples)
- TestResults: Résultats et scoring automatique
*/

USE [GestionProjetDB];
GO

-- ================================================================================
-- 1. TESTS
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tests')
    CREATE TABLE [dbo].[Tests] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [Titre] VARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX),
        [TypeTest] VARCHAR(50), -- 'QCM', 'Technique', 'Mixte'
        [DureeMinutes] INT DEFAULT 60,
        [ScoreMinimum] DECIMAL(5,2) DEFAULT 50.00,
        [SocieteId] VARCHAR(100),
        [CreeParId] VARCHAR(100),
        [Poste] VARCHAR(255), -- Poste cible
        [Actif] BIT DEFAULT 1,
        [DateCreation] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- 2. QUESTIONS
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
    CREATE TABLE [dbo].[Questions] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TestId] VARCHAR(100) NOT NULL,
        [Texte] NVARCHAR(MAX) NOT NULL,
        [TypeQuestion] VARCHAR(50), -- 'QCM', 'Texte', 'Code'
        [Points] DECIMAL(5,2) DEFAULT 1.00,
        [Ordre] INT DEFAULT 0,
        [Actif] BIT DEFAULT 1
    );
GO

-- ================================================================================
-- 3. RÉPONSES (pour QCM)
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reponses')
    CREATE TABLE [dbo].[Reponses] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [QuestionId] VARCHAR(100) NOT NULL,
        [Texte] NVARCHAR(500) NOT NULL,
        [EstCorrecte] BIT DEFAULT 0,
        [Ordre] INT DEFAULT 0
    );
GO

-- ================================================================================
-- 4. RÉSULTATS TESTS
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TestResults')
    CREATE TABLE [dbo].[TestResults] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TestId] VARCHAR(100) NOT NULL,
        [UtilisateurId] VARCHAR(100) NOT NULL,
        [ApplicationId] VARCHAR(100), -- Lien avec candidature
        [Score] DECIMAL(5,2) DEFAULT 0,
        [Pourcentage] DECIMAL(5,2) DEFAULT 0,
        [EstPasse] BIT DEFAULT 0,
        [TempsEcouleMinutes] INT,
        [DateDebut] DATETIME,
        [DateFin] DATETIME,
        [ReponsesJson] NVARCHAR(MAX), -- Stockage des réponses
        [DateCreation] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- 5. PROCÉDURES: TESTS
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_i] 
    @Id VARCHAR(100), @Titre VARCHAR(255), @Description NVARCHAR(MAX), @TypeTest VARCHAR(50),
    @DureeMinutes INT, @ScoreMinimum DECIMAL(5,2), @SocieteId VARCHAR(100), @CreeParId VARCHAR(100),
    @Poste VARCHAR(255), @Actif BIT
AS BEGIN 
    INSERT INTO Tests (Id, Titre, Description, TypeTest, DureeMinutes, ScoreMinimum, SocieteId, CreeParId, Poste, Actif) 
    VALUES (@Id, @Titre, @Description, @TypeTest, @DureeMinutes, @ScoreMinimum, @SocieteId, @CreeParId, @Poste, @Actif); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_u] 
    @Id VARCHAR(100), @Titre VARCHAR(255), @Description NVARCHAR(MAX), @TypeTest VARCHAR(50),
    @DureeMinutes INT, @ScoreMinimum DECIMAL(5,2), @SocieteId VARCHAR(100), @CreeParId VARCHAR(100),
    @Poste VARCHAR(255), @Actif BIT
AS BEGIN 
    UPDATE Tests SET Titre=@Titre, Description=@Description, TypeTest=@TypeTest, DureeMinutes=@DureeMinutes, 
    ScoreMinimum=@ScoreMinimum, SocieteId=@SocieteId, CreeParId=@CreeParId, Poste=@Poste, Actif=@Actif WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_d] @Id VARCHAR(100) AS BEGIN 
    DELETE FROM TestResults WHERE TestId=@Id;
    DELETE FROM Reponses WHERE QuestionId IN (SELECT Id FROM Questions WHERE TestId=@Id);
    DELETE FROM Questions WHERE TestId=@Id;
    DELETE FROM Tests WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM Tests WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_s_Liste] AS BEGIN SELECT * FROM Tests ORDER BY DateCreation DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_s_ParSociete] @SocieteId VARCHAR(100) AS BEGIN SELECT * FROM Tests WHERE SocieteId=@SocieteId OR SocieteId IS NULL END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Test_s_Actifs] AS BEGIN SELECT * FROM Tests WHERE Actif=1 END
GO

-- ================================================================================
-- 6. PROCÉDURES: QUESTIONS
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Question_i] 
    @Id VARCHAR(100), @TestId VARCHAR(100), @Texte NVARCHAR(MAX), @TypeQuestion VARCHAR(50), 
    @Points DECIMAL(5,2), @Ordre INT, @Actif BIT
AS BEGIN 
    INSERT INTO Questions (Id, TestId, Texte, TypeQuestion, Points, Ordre, Actif) 
    VALUES (@Id, @TestId, @Texte, @TypeQuestion, @Points, @Ordre, @Actif); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Question_u] 
    @Id VARCHAR(100), @TestId VARCHAR(100), @Texte NVARCHAR(MAX), @TypeQuestion VARCHAR(50), 
    @Points DECIMAL(5,2), @Ordre INT, @Actif BIT
AS BEGIN 
    UPDATE Questions SET TestId=@TestId, Texte=@Texte, TypeQuestion=@TypeQuestion, Points=@Points, Ordre=@Ordre, Actif=@Actif WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Question_d] @Id VARCHAR(100) AS BEGIN 
    DELETE FROM Reponses WHERE QuestionId=@Id;
    DELETE FROM Questions WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Question_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM Questions WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Question_s_ParTest] @TestId VARCHAR(100) AS BEGIN SELECT * FROM Questions WHERE TestId=@TestId ORDER BY Ordre END
GO

-- ================================================================================
-- 7. PROCÉDURES: RÉPONSES
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Reponse_i] 
    @Id VARCHAR(100), @QuestionId VARCHAR(100), @Texte NVARCHAR(500), @EstCorrecte BIT, @Ordre INT
AS BEGIN 
    INSERT INTO Reponses (Id, QuestionId, Texte, EstCorrecte, Ordre) 
    VALUES (@Id, @QuestionId, @Texte, @EstCorrecte, @Ordre); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Reponse_u] 
    @Id VARCHAR(100), @QuestionId VARCHAR(100), @Texte NVARCHAR(500), @EstCorrecte BIT, @Ordre INT
AS BEGIN 
    UPDATE Reponses SET QuestionId=@QuestionId, Texte=@Texte, EstCorrecte=@EstCorrecte, Ordre=@Ordre WHERE Id=@Id; 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Reponse_d] @Id VARCHAR(100) AS BEGIN DELETE FROM Reponses WHERE Id=@Id; SELECT @@ROWCOUNT; END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Reponse_s_ParQuestion] @QuestionId VARCHAR(100) AS BEGIN SELECT * FROM Reponses WHERE QuestionId=@QuestionId ORDER BY Ordre END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_Reponse_s_Correctes] @QuestionId VARCHAR(100) AS BEGIN SELECT Id FROM Reponses WHERE QuestionId=@QuestionId AND EstCorrecte=1 END
GO

-- ================================================================================
-- 8. PROCÉDURES: RÉSULTATS (Scoring automatique)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TestResult_i] 
    @Id VARCHAR(100), @TestId VARCHAR(100), @UtilisateurId VARCHAR(100), @ApplicationId VARCHAR(100),
    @Score DECIMAL(5,2), @Pourcentage DECIMAL(5,2), @EstPasse BIT, @TempsEcouleMinutes INT,
    @DateDebut DATETIME, @DateFin DATETIME, @ReponsesJson NVARCHAR(MAX)
AS BEGIN 
    INSERT INTO TestResults (Id, TestId, UtilisateurId, ApplicationId, Score, Pourcentage, EstPasse, TempsEcouleMinutes, DateDebut, DateFin, ReponsesJson) 
    VALUES (@Id, @TestId, @UtilisateurId, @ApplicationId, @Score, @Pourcentage, @EstPasse, @TempsEcouleMinutes, @DateDebut, @DateFin, @ReponsesJson); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TestResult_s_ParId] @Id VARCHAR(100) AS BEGIN SELECT * FROM TestResults WHERE Id=@Id END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TestResult_s_ParTest] @TestId VARCHAR(100) AS BEGIN SELECT * FROM TestResults WHERE TestId=@TestId ORDER BY Pourcentage DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TestResult_s_ParUtilisateur] @UtilisateurId VARCHAR(100) AS BEGIN SELECT * FROM TestResults WHERE UtilisateurId=@UtilisateurId ORDER BY DateCreation DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_TestResult_s_ParApplication] @ApplicationId VARCHAR(100) AS BEGIN SELECT * FROM TestResults WHERE ApplicationId=@ApplicationId END
GO

-- ================================================================================
-- 9. PROCÉDURE: CLASSEMENT CANDIDATS
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_ClassementCandidats] @TestId VARCHAR(100) AS
BEGIN
    SELECT 
        tr.ApplicationId,
        tr.UtilisateurId,
        u.Nom + ' ' + u.Prenom AS CandidatNom,
        u.Email AS CandidatEmail,
        tr.Score,
        tr.Pourcentage,
        tr.TempsEcouleMinutes,
        tr.DateFin,
        CASE WHEN tr.Pourcentage >= t.ScoreMinimum THEN 'Admis' ELSE 'Éliminé' END AS Statut,
        ROW_NUMBER() OVER (ORDER BY tr.Pourcentage DESC) AS Rang
    FROM TestResults tr
    INNER JOIN Tests t ON tr.TestId = t.Id
    INNER JOIN Utilisateurs u ON tr.UtilisateurId = u.Id
    WHERE tr.TestId = @TestId
    ORDER BY tr.Pourcentage DESC
END
GO

PRINT '>>> Module 9 Tests & Scoring créé avec succès';
GO