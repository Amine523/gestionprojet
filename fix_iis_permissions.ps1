# Fix IIS 500.19 - 0x80070005 Permissions Error
# Run this script as Administrator

$sitePath = "C:\projet pfe\Sites\SoftProNuGetWebServer"
$parentPath = "C:\projet pfe\Sites"
$rootPath = "C:\projet pfe"

Write-Host "=== Fixing IIS Permissions ===" -ForegroundColor Cyan

# Grant IIS_IUSRS and IUSR read+execute access to all levels
foreach ($path in @($rootPath, $parentPath, $sitePath)) {
    Write-Host "Granting access to: $path" -ForegroundColor Yellow
    icacls "$path" /grant "IIS_IUSRS:(OI)(CI)RX" /grant "IUSR:(OI)(CI)RX"
}

# Get the actual Application Pool name from IIS
Write-Host "`nDetecting Application Pools..." -ForegroundColor Cyan
Import-Module WebAdministration -ErrorAction SilentlyContinue

$site = Get-Website | Where-Object { $_.Bindings.Collection | Where-Object { $_.bindingInformation -like "*30000*" } }
if ($site) {
    $poolName = $site.applicationPool
    Write-Host "Found site: $($site.Name), Pool: $poolName" -ForegroundColor Green
    icacls "$sitePath" /grant "IIS AppPool\${poolName}:(OI)(CI)RX" /T
    Write-Host "Granted access to pool: $poolName" -ForegroundColor Green
} else {
    Write-Host "Could not detect site automatically. Trying common pool names..." -ForegroundColor Yellow
    # Grant all existing app pools just in case
    Get-ChildItem "IIS:\AppPools" -ErrorAction SilentlyContinue | ForEach-Object {
        $poolName = $_.Name
        Write-Host "  Granting: IIS AppPool\$poolName"
        icacls "$sitePath" /grant "IIS AppPool\${poolName}:(OI)(CI)RX" /T 2>$null
    }
}

# Also ensure NETWORK SERVICE has access (fallback)
icacls "$sitePath" /grant "NETWORK SERVICE:(OI)(CI)RX" /T

Write-Host "`nRestarting IIS..." -ForegroundColor Cyan
iisreset

Write-Host "`n=== Done! Try http://localhost:30000/ again ===" -ForegroundColor Green
