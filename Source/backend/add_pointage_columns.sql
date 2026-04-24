-- Execute this script in SQL Server Management Studio
-- to ensure Pointage table has all required columns

USE [GestionProjetDB];
GO

-- Check if Pointage table exists and has required columns
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'TypeId')
    ALTER TABLE [Pointage] ADD [TypeId] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'HeureEntree')
    ALTER TABLE [Pointage] ADD [HeureEntree] TIME NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'HeureSortie')
    ALTER TABLE [Pointage] ADD [HeureSortie] TIME NULL;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'Duree')
    ALTER TABLE [Pointage] ADD [Duree] FLOAT NULL;

PRINT 'Pointage columns checked/added successfully.';
