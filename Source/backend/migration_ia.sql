/*
================================================================================
MODULE 10: INTELLIGENCE ARTIFICIELLE (OLLAMA)
================================================================================
Tables:
- AIPredictions: Stockage des prédictions IA
- AICandidatesRanking: Classement intelligent des candidats
- AIProjectAnalysis: Analyse prédictive des projets
- AIAnalystLogs: Logs des analyses IA
*/

USE [GestionProjetDB];
GO

-- ================================================================================
-- 1. TABLES IA
-- ================================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AIPredictions')
    CREATE TABLE [dbo].[AIPredictions] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TypePrediction] VARCHAR(50), -- 'Candidat', 'Projet', 'Performance'
        [EntiteType] VARCHAR(50), -- 'Application', 'Projet', 'Utilisateur'
        [EntiteId] VARCHAR(100),
        [ScorePrediction] DECIMAL(5,2),
        [Recommandation] NVARCHAR(500),
        [Confiance] DECIMAL(5,2),
        [ModeleUtilise] VARCHAR(100),
        [ParametresJson] NVARCHAR(MAX),
        [DatePrediction] DATETIME DEFAULT GETDATE()
    );
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AICandidatesRanking')
    CREATE TABLE [dbo].[AICandidatesRanking] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TestId] VARCHAR(100),
        [ApplicationId] VARCHAR(100),
        [ScoreIA] DECIMAL(5,2),
        [ScoreTraditionnel] DECIMAL(5,2),
        [ScoreFinal] DECIMAL(5,2),
        [Rang] INT,
        [Justification] NVARCHAR(MAX),
        [DateAnalyse] DATETIME DEFAULT GETDATE()
    );
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AIProjectAnalysis')
    CREATE TABLE [dbo].[AIProjectAnalysis] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [ProjetId] VARCHAR(100),
        [PredictionRetard] DECIMAL(5,2),
        [RisquesJson] NVARCHAR(MAX),
        [RecommandationsJson] NVARCHAR(MAX),
        [TendanceProductivite] DECIMAL(5,2),
        [DateAnalyse] DATETIME DEFAULT GETDATE()
    );
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AIAnalystLogs')
    CREATE TABLE [dbo].[AIAnalystLogs] (
        [Id] VARCHAR(100) PRIMARY KEY,
        [TypeAnalyse] VARCHAR(100),
        [EntiteId] VARCHAR(100),
        [PromptJson] NVARCHAR(MAX),
        [ResponseJson] NVARCHAR(MAX),
        [DureeSeconds] INT,
        [Statut] VARCHAR(20),
        [Erreur] NVARCHAR(MAX),
        [DateCreation] DATETIME DEFAULT GETDATE()
    );
GO

-- ================================================================================
-- 2. PROCEDURES STOCKÉES (AIPredictions)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIPrediction_i] 
    @Id VARCHAR(100), @TypePrediction VARCHAR(50), @EntiteType VARCHAR(50), @EntiteId VARCHAR(100),
    @ScorePrediction DECIMAL(5,2), @Recommandation NVARCHAR(500), @Confiance DECIMAL(5,2),
    @ModeleUtilise VARCHAR(100), @ParametresJson NVARCHAR(MAX)
AS BEGIN 
    INSERT INTO AIPredictions (Id, TypePrediction, EntiteType, EntiteId, ScorePrediction, Recommandation, Confiance, ModeleUtilise, ParametresJson) 
    VALUES (@Id, @TypePrediction, @EntiteType, @EntiteId, @ScorePrediction, @Recommandation, @Confiance, @ModeleUtilise, @ParametresJson); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIPrediction_s_ParEntite] @EntiteType VARCHAR(50), @EntiteId VARCHAR(100) 
AS BEGIN SELECT * FROM AIPredictions WHERE EntiteType=@EntiteType AND EntiteId=@EntiteId ORDER BY DatePrediction DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIPrediction_s_Liste] AS BEGIN SELECT * FROM AIPredictions ORDER BY DatePrediction DESC END
GO

-- ================================================================================
-- 3. PROCEDURES STOCKÉES (AICandidatesRanking)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AICandidateRanking_i] 
    @Id VARCHAR(100), @TestId VARCHAR(100), @ApplicationId VARCHAR(100), @ScoreIA DECIMAL(5,2),
    @ScoreTraditionnel DECIMAL(5,2), @ScoreFinal DECIMAL(5,2), @Rang INT, @Justification NVARCHAR(MAX)
AS BEGIN 
    INSERT INTO AICandidatesRanking (Id, TestId, ApplicationId, ScoreIA, ScoreTraditionnel, ScoreFinal, Rang, Justification) 
    VALUES (@Id, @TestId, @ApplicationId, @ScoreIA, @ScoreTraditionnel, @ScoreFinal, @Rang, @Justification); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AICandidatesRanking_s_ParTest] @TestId VARCHAR(100) 
AS BEGIN SELECT * FROM AICandidatesRanking WHERE TestId=@TestId ORDER BY Rang END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AICandidatesRanking_s_Liste] AS BEGIN SELECT * FROM AICandidatesRanking ORDER BY DateAnalyse DESC END
GO

-- ================================================================================
-- 4. PROCEDURES STOCKÉES (AIProjectAnalysis)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIProjectAnalysis_i] 
    @Id VARCHAR(100), @ProjetId VARCHAR(100), @PredictionRetard DECIMAL(5,2), @RisquesJson NVARCHAR(MAX),
    @RecommandationsJson NVARCHAR(MAX), @TendanceProductivite DECIMAL(5,2)
AS BEGIN 
    INSERT INTO AIProjectAnalysis (Id, ProjetId, PredictionRetard, RisquesJson, RecommandationsJson, TendanceProductivite) 
    VALUES (@Id, @ProjetId, @PredictionRetard, @RisquesJson, @RecommandationsJson, @TendanceProductivite); 
    SELECT @@ROWCOUNT; 
END
GO

CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIProjectAnalysis_s_ParProjet] @ProjetId VARCHAR(100) 
AS BEGIN SELECT * FROM AIProjectAnalysis WHERE ProjetId=@ProjetId ORDER BY DateAnalyse DESC END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIProjectAnalysis_s_Liste] AS BEGIN SELECT * FROM AIProjectAnalysis ORDER BY DateAnalyse DESC END
GO

-- ================================================================================
-- 5. PROCEDURES STOCKÉES (AIAnalystLogs)
-- ================================================================================
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIAnalystLog_i] 
    @Id VARCHAR(100), @TypeAnalyse VARCHAR(100), @EntiteId VARCHAR(100), 
    @PromptJson NVARCHAR(MAX), @ResponseJson NVARCHAR(MAX), @DureeSeconds INT, @Statut VARCHAR(20), @Erreur NVARCHAR(MAX)
AS BEGIN 
    INSERT INTO AIAnalystLogs (Id, TypeAnalyse, EntiteId, PromptJson, ResponseJson, DureeSeconds, Statut, Erreur) 
    VALUES (@Id, @TypeAnalyse, @EntiteId, @PromptJson, @ResponseJson, @DureeSeconds, @Statut, @Erreur); 
    SELECT @@ROWCOUNT; 
END
GO
CREATE OR ALTER PROCEDURE [dbo].[ps_ApiParamSociete_AIAnalystLog_s_Liste] AS BEGIN SELECT * FROM AIAnalystLogs ORDER BY DateCreation DESC END
GO

PRINT '>>> Tables et procédures IA créés avec succès';
GO