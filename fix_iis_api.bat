@echo off
:: Ce script DOIT etre execute en tant qu'Administrateur

echo ================================================
echo  Correction IIS 500.19 - Erreur 0x80070005 (API)
echo ================================================
echo.

set SITE_PATH=C:\projet pfe\Sites\Gestprojet.Core.ApiParamSociete.WebApi

:: === Etape 1: Supprimer les regles DENY potentielles ===
echo [1/3] Suppression des regles DENY existantes...
icacls "%SITE_PATH%" /remove:d "IIS_IUSRS" /T 2>nul
icacls "%SITE_PATH%" /remove:d "IUSR" /T 2>nul
icacls "%SITE_PATH%" /remove:d "NETWORK SERVICE" /T 2>nul
icacls "C:\projet pfe" /remove:d "IIS_IUSRS" 2>nul
icacls "C:\projet pfe\Sites" /remove:d "IIS_IUSRS" 2>nul

:: === Etape 2: Appliquer les permissions sur toute la chaine de dossiers ===
echo [2/3] Permissions sur C:\projet pfe ...
icacls "C:\projet pfe" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX"

echo Permissions sur C:\projet pfe\Sites ...
icacls "C:\projet pfe\Sites" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX"

echo Permissions recursives sur le dossier API ...
icacls "%SITE_PATH%" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX" /T
icacls "%SITE_PATH%" /grant "IIS AppPool\GestprojetApiPool:(OI)(CI)RX" /T 2>nul

:: === Etape 3: Redemarrer IIS ===
echo [3/3] Redemarrage d'IIS...
iisreset /restart

echo ================================================
echo  TERMINE ! Testez http://localhost:31001/swagger/index.html
echo ================================================
pause
