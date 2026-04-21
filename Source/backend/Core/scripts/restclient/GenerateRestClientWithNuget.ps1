# Generate REST Client using Java-based OpenAPI Generator and create NuGet package
param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectFilePath,
    [Parameter(Mandatory=$false)]
    [string]$WebApiJsonPath,
    [Parameter(Mandatory=$true)]
    [string]$DestPath,
    [Parameter(Mandatory=$false)]
    [string]$ApiName,
    [Parameter(Mandatory=$false)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

function Write-Section([string]$Title) {
    Write-Host ""
    Write-Host "==============================================================="
    Write-Host " $Title"
    Write-Host "==============================================================="
    Write-Host ""
}

function Get-NormalizedProjectPath {
    if (Test-Path $ProjectFilePath -PathType Leaf) { return $ProjectFilePath }
    if (Test-Path $ProjectFilePath -PathType Container) {
        $proj = Get-ChildItem $ProjectFilePath -Filter "*.csproj" | Select-Object -First 1
        if (!$proj) { throw "No .csproj found" }
        return $proj.FullName
    }
    return $ProjectFilePath
}

function Get-WebApiPath {
    if ($WebApiJsonPath) { return $WebApiJsonPath }
    $dir = Split-Path $ProjectFilePath
    $paths = @("webapi.json","swagger.json","openapi.json") | ForEach-Object { Join-Path $dir $_ }
    foreach ($p in $paths) { if (Test-Path $p) { return $p } }
    return Join-Path $dir "webapi.json"
}

function Get-RestClientName {
    if ($ApiName) { return $ApiName + ".RestClient" }
    $xml = [xml](Get-Content $ProjectFilePath)
    return "RestClient"
}

function Get-ProjectVersion {
    if ($Version) { return $Version }
    return "1.0.0"
}

try {
    $ProjectFilePath = Get-NormalizedProjectPath
    $WebApiJsonPath = Get-WebApiPath
    
    $DestPathAbsolute = $DestPath
    if (-not [System.IO.Path]::IsPathRooted($DestPath)) {
        $DestPathAbsolute = Join-Path (Get-Location).Path $DestPath
        $DestPathAbsolute = [System.IO.Path]::GetFullPath($DestPathAbsolute)
    }
    
    $RestClientDestPath = Join-Path $DestPathAbsolute ($ApiName + '.RestClient')
    $RestClientName = $ApiName + ".Client"
    $RestClientVersion = Get-ProjectVersion

    Write-Section "REST Client Generation Configuration"
    Write-Host " Project file path       => $ProjectFilePath"
    Write-Host " WebAPI JSON spec        => $WebApiJsonPath"
    Write-Host " RestClient destination  => $RestClientDestPath"
    Write-Host " RestClient name         => $RestClientName"
    Write-Host " RestClient version      => $RestClientVersion"

    if (!(Test-Path $ProjectFilePath)) { 
        throw "Project file not found: $ProjectFilePath" 
    }

    if (!(Test-Path $WebApiJsonPath)) { 
        throw "WebAPI JSON file not found: $WebApiJsonPath" 
    }

    Write-Section "Generating REST Client with Java OpenAPI Generator"
    
    $jarPath = "..\..\tools\openapi-generator\openapi-generator-cli-5.1.0.jar"
    if (!(Test-Path $jarPath)) {
        throw "OpenAPI Generator JAR not found: $jarPath"
    }
    
    $jarPathAbsolute = (Resolve-Path $jarPath).Path
    Write-Host "Found JAR: $jarPathAbsolute" -ForegroundColor Gray

    if (!(Test-Path $RestClientDestPath)) {
        New-Item -ItemType Directory -Path $RestClientDestPath -Force | Out-Null
        Write-Host "Created directory: $RestClientDestPath" -ForegroundColor Cyan
    }

    Write-Host "Generating C# code from OpenAPI spec..." -ForegroundColor Cyan
    $openApiJsonAbsolute = (Resolve-Path $WebApiJsonPath).Path
    
    java -jar "$jarPathAbsolute" generate `
        -i "$openApiJsonAbsolute" `
        -g csharp-netcore `
        -o "$RestClientDestPath" `
        -p "packageName=$RestClientName" `
        -p "packageVersion=$RestClientVersion" `
        --skip-validate-spec 2>&1 | Out-Host

    if ($LASTEXITCODE -ne 0) {
        throw "OpenAPI Generator failed"
    }

    Write-Host "REST Client C# code generated successfully" -ForegroundColor Green

    Write-Section "Restructuring to match your project format"
    
    # Move files from src subfolder to root level
    $srcFolder = Join-Path $RestClientDestPath "src"
    if (Test-Path $srcFolder) {
        Write-Host "Moving files from src subfolder to root..." -ForegroundColor Cyan
        
        # Move all files and folders from src to root
        Get-ChildItem $srcFolder | ForEach-Object {
            Move-Item $_.FullName -Destination $RestClientDestPath -Force
        }
        
        # Remove src folder
        Remove-Item $srcFolder -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Restructured project layout" -ForegroundColor Green
    }
    
    # Fix .sln file to reference projects in root instead of src
    $slnFile = Get-ChildItem $RestClientDestPath -Filter "*.sln" | Select-Object -First 1
    if ($slnFile) {
        Write-Host "Updating solution file..." -ForegroundColor Cyan
        $slnContent = Get-Content $slnFile.FullName -Raw
        $slnContent = $slnContent -replace 'src\\', ''
        Set-Content $slnFile.FullName -Value $slnContent
        Write-Host "Updated .sln file" -ForegroundColor Green
    }
    
    # Clean up unnecessary files/folders
    Write-Host "Cleaning up temporary files..." -ForegroundColor Cyan
    @("README.md", ".openapi-generator*", "appveyor.yml", "git_push.sh", "docs") | ForEach-Object {
        Get-ChildItem $RestClientDestPath -Filter $_ -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
    }
    
    Write-Host "Cleaned up temporary files" -ForegroundColor Green

    Write-Section "Building and Packaging as NuGet"
    
    # Find the .csproj file in the root or subdirectories
    $csprojFile = Get-ChildItem $RestClientDestPath -Filter "*.csproj" -Recurse | Where-Object {-not ($_.FullName -like "*Test*")} | Select-Object -First 1
    
    if (-not $csprojFile) {
        throw "No .csproj file found"
    }
    
    $csprojPath = $csprojFile.FullName
    Write-Host "Found .csproj: $(Split-Path $csprojPath -Leaf)" -ForegroundColor Gray
    
    Write-Host "Building project..." -ForegroundColor Cyan
    dotnet build "$csprojPath" --configuration Release -v minimal 2>&1 | Out-Host
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    
    Write-Host "Build completed successfully!" -ForegroundColor Green

    Write-Host ""
    Write-Host "Creating NuGet package..." -ForegroundColor Cyan
    
    # Pack directly to root folder
    $nupkgDir = $RestClientDestPath
    
    Push-Location (Split-Path $csprojPath)
    dotnet pack --configuration Release --output "$nupkgDir" 2>&1 | Out-Null
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "NuGet package created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Warning: NuGet pack completed with code $LASTEXITCODE" -ForegroundColor Yellow
    }
    
    $nupkgFiles = Get-ChildItem $RestClientDestPath -Filter "*.nupkg" -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if ($nupkgFiles) {
        $nupkgPath = $nupkgFiles.FullName
        Write-Host ""
        Write-Host "Found NuGet package: $(Split-Path $nupkgPath -Leaf)" -ForegroundColor Green
        Write-Host "  Location: $nupkgPath" -ForegroundColor Cyan
        
        $nugetServerPath = "D:\projet pfe\Sites\SoftProNuGetWebServer\Packages"
        Write-Host ""
        Write-Host "Deploying to NuGet server..." -ForegroundColor Cyan
        
        if (!(Test-Path $nugetServerPath)) {
            Write-Host "Creating NuGet server directory..." -ForegroundColor Yellow
            New-Item -ItemType Directory -Path $nugetServerPath -Force | Out-Null
        }
        
        Copy-Item -Path "$nupkgPath" -Destination "$nugetServerPath" -Force
        Write-Host "Package deployed successfully!" -ForegroundColor Green
        Write-Host "  Destination: $nugetServerPath\$(Split-Path $nupkgPath -Leaf)" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Warning: NuGet package not found" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "===============================================================" -ForegroundColor Green
    Write-Host "  SUCCESS: REST Client Generated and Packaged!" -ForegroundColor Green
    Write-Host "===============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Location: $RestClientDestPath" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "===============================================================" -ForegroundColor Red
    Write-Host "  FATAL ERROR" -ForegroundColor Red
    Write-Host "===============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}
