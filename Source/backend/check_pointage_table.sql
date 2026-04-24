-- Execute this script in SQL Server Management Studio
-- to check and fix Pointage table structure

USE [GestionProjetDB];
GO

-- Check if Pointage table exists
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Pointage')
BEGIN
    PRINT 'Pointage table does not exist. Creating it...';
    
    CREATE TABLE [dbo].[Pointage] (
        [Id] NVARCHAR(50) PRIMARY KEY,
        [UtilisateurId] NVARCHAR(50) NULL,
        [TypeId] NVARCHAR(50) NULL,
        [Date] DATE NULL,
        [HeureEntree] TIME NULL,
        [HeureSortie] TIME NULL,
        [Duree] FLOAT NULL,
        [Note] NVARCHAR(255) NULL,
        [Actif] BIT NULL
    );
    
    PRINT 'Pointage table created successfully.';
END
ELSE
BEGIN
    PRINT 'Pointage table exists. Checking columns...';
    
    -- Add missing columns
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'TypeId')
        ALTER TABLE [Pointage] ADD [TypeId] NVARCHAR(50) NULL;
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'Date')
        ALTER TABLE [Pointage] ADD [Date] DATE NULL;
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'HeureEntree')
        ALTER TABLE [Pointage] ADD [HeureEntree] TIME NULL;
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'HeureSortie')
        ALTER TABLE [Pointage] ADD [HeureSortie] TIME NULL;
    
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Pointage' AND COLUMN_NAME = 'Duree')
        ALTER TABLE [Pointage] ADD [Duree] FLOAT NULL;
    
    PRINT 'Pointage columns checked/added successfully.';
END

-- Display current table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Pointage'
ORDER BY ORDINAL_POSITION;
