@echo off
:: Ce script DOIT etre execute en tant qu'Administrateur
:: Clic droit > "Executer en tant qu'administrateur"

echo ================================================
echo  Correction IIS 500.19 - Erreur 0x80070005
echo ================================================
echo.

set SITE_PATH=C:\projet pfe\Sites\SoftProNuGetWebServer

:: === Etape 1: Afficher les permissions actuelles ===
echo [INFO] Permissions actuelles sur le dossier :
icacls "%SITE_PATH%"
echo.

:: === Etape 2: Supprimer les regles DENY potentielles ===
echo [1/5] Suppression des regles DENY existantes...
icacls "%SITE_PATH%" /remove:d "IIS_IUSRS" /T 2>nul
icacls "%SITE_PATH%" /remove:d "IUSR" /T 2>nul
icacls "%SITE_PATH%" /remove:d "NETWORK SERVICE" /T 2>nul
icacls "C:\projet pfe" /remove:d "IIS_IUSRS" 2>nul
icacls "C:\projet pfe\Sites" /remove:d "IIS_IUSRS" 2>nul

:: === Etape 3: Appliquer les permissions sur toute la chaine de dossiers ===
echo [2/5] Permissions sur C:\projet pfe ...
icacls "C:\projet pfe" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX"
if %errorlevel% neq 0 (echo [ERREUR] Echec - Etes-vous bien en mode Administrateur ?) && goto :end

echo [3/5] Permissions sur C:\projet pfe\Sites ...
icacls "C:\projet pfe\Sites" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX"

echo [4/5] Permissions recursives sur le dossier NuGet ...
icacls "%SITE_PATH%" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX" /grant "NETWORK SERVICE:(OI)(CI)RX" /T

:: === Etape 4: Trouver et donner acces au pool d'applications ===
echo [5/5] Recherche du pool d'applications IIS sur port 30000...
for /f "tokens=1,2" %%a in ('C:\Windows\System32\inetsrv\appcmd list site /bindings:"http/*:30000:" 2^>nul') do (
    echo Site trouve: %%b
)
C:\Windows\System32\inetsrv\appcmd list site /bindings:"http/*:30000:" 2>nul > "%TEMP%\iis_sites.txt"
for /f "tokens=3 delims=:" %%a in ('C:\Windows\System32\inetsrv\appcmd list site 2^>nul ^| findstr /i "30000"') do (
    echo Port 30000 trouve dans: %%a
)

:: Lister tous les pools et appliquer les permissions
echo.
echo Application des permissions a tous les pools existants...
for /f "tokens=2 delims=:" %%p in ('C:\Windows\System32\inetsrv\appcmd list apppool 2^>nul') do (
    for /f "tokens=1 delims= " %%q in ("%%p") do (
        echo   Ajout acces pour pool: %%q
        icacls "%SITE_PATH%" /grant "IIS AppPool\%%q:(OI)(CI)RX" /T 2>nul
    )
)

:: === Etape 5: Afficher les nouvelles permissions ===
echo.
echo [INFO] Nouvelles permissions :
icacls "%SITE_PATH%"
echo.

:: === Etape 6: Redemarrer IIS ===
echo Redemarrage d'IIS...
iisreset /restart
echo.

echo ================================================
echo  TERMINE ! Testez http://localhost:30000/
echo ================================================
:end
pause
