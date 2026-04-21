@echo off
echo --- Configuration de l'utilisateur IIS dans SQL Server ---
echo.
echo Tentative de connexion a SQL Server pour autoriser l'API...

set SQL_SCRIPT=%TEMP%\add_iis_login.sql
echo USE master; > "%SQL_SCRIPT%"
echo IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'IIS APPPOOL\GestprojetApiPool') >> "%SQL_SCRIPT%"
echo     CREATE LOGIN [IIS APPPOOL\GestprojetApiPool] FROM WINDOWS; >> "%SQL_SCRIPT%"
echo USE [GestionProjetDB]; >> "%SQL_SCRIPT%"
echo IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'IIS APPPOOL\GestprojetApiPool') >> "%SQL_SCRIPT%"
echo     CREATE USER [IIS APPPOOL\GestprojetApiPool] FOR LOGIN [IIS APPPOOL\GestprojetApiPool]; >> "%SQL_SCRIPT%"
echo EXEC sp_addrolemember 'db_owner', 'IIS APPPOOL\GestprojetApiPool'; >> "%SQL_SCRIPT%"

sqlcmd -S DESKTOP-N4BE8UE -E -i "%SQL_SCRIPT%"
if %errorlevel% neq 0 (
    echo [!ERREUR!] Impossible de se connecter a SQL Server. 
    echo Assurez-vous d'etre administrateur sur l'instance.
) else (
    echo [SUCCES] L'utilisateur anonyme IIS (GestprojetApiPool) a ete autorise dans SQL Server !
)

echo.
echo Veuillez rafraichir votre page Swagger. L'erreur de base de donnees devrait avoir disparu.
pause
