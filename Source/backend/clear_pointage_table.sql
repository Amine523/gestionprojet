-- Execute this script in SQL Server Management Studio
-- to clear the Pointage table and fix the duplicate key issue

USE [GestionProjetDB];
GO

-- Delete all records from Pointage table
DELETE FROM [dbo].[Pointage];

-- Verify the table is empty
SELECT COUNT(*) as 'Remaining Records' FROM [dbo].[Pointage];

PRINT 'Pointage table cleared successfully.';
