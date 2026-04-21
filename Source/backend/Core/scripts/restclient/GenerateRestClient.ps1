# Get Command Line Parameters
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
    [string]$Version,

    [Parameter(Mandatory=$false)]
    [string]$DeploymentPath
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "==============================================================="
    Write-Host " $Title"
    Write-Host "==============================================================="
    Write-Host ""
}

# 🔥 CRAZY SOLUTION: Generate OpenAPI by actually running the WebAPI!
function Generate-OpenApiFromRunningWebApi($projectPath, $outputPath) {
    Write-Section "🚀 GENERATING REAL OPENAPI FROM RUNNING WEBAPI"
    
    $projDir = Split-Path $projectPath
    
    Write-Host "Step 1: Building WebAPI project..." -ForegroundColor Cyan
    dotnet build $projectPath -c Release --nologo -v minimal | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to build WebAPI project"
    }
    
    Write-Host "Step 2: Starting WebAPI temporarily..." -ForegroundColor Cyan
    Write-Host "  (This will run for ~5 seconds to generate Swagger JSON)" -ForegroundColor Yellow
    
    # Start the WebAPI in the background
    $apiProcess = Start-Process -FilePath "dotnet" `
        -ArgumentList "run --project `"$projectPath`" --no-build --configuration Release --urls http://localhost:5555" `
        -PassThru `
        -WindowStyle Hidden
    
    Write-Host "  WebAPI process started (PID: $($apiProcess.Id))" -ForegroundColor Gray
    
    # Wait for API to start (give it a few seconds)
    Write-Host "  Waiting for API to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 8
    
    try {
        Write-Host "Step 3: Downloading Swagger JSON from running API..." -ForegroundColor Cyan
        
        # Try to download the swagger.json
        $swaggerUrl = "http://localhost:5555/swagger/v1/swagger.json"
        Write-Host "  Requesting: $swaggerUrl" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri $swaggerUrl -TimeoutSec 10 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            $response.Content | Out-File $outputPath -Encoding UTF8
            Write-Host "  ✓ SUCCESS: Downloaded Swagger JSON!" -ForegroundColor Green
            
            # Validate it has paths
            $json = $response.Content | ConvertFrom-Json
            $pathCount = ($json.paths | Get-Member -MemberType NoteProperty).Count
            Write-Host "  ✓ Found $pathCount endpoint(s) in OpenAPI spec!" -ForegroundColor Green
        } else {
            throw "Unexpected status code: $($response.StatusCode)"
        }
    }
    catch {
        Write-Host "  ✗ Could not download Swagger JSON: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "  Falling back to existing webapi.json..." -ForegroundColor Yellow
    }
    finally {
        # Always kill the API process
        Write-Host "Step 4: Stopping WebAPI..." -ForegroundColor Cyan
        if ($apiProcess -and !$apiProcess.HasExited) {
            Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue
            Write-Host "  ✓ WebAPI stopped" -ForegroundColor Gray
        }
    }
    
    # Verify the file exists and has content
    if (!(Test-Path $outputPath)) {
        throw "OpenAPI file was not created: $outputPath"
    }
    
    $content = Get-Content $outputPath -Raw
    if ($content.Length -lt 100) {
        throw "OpenAPI file appears to be empty or invalid"
    }
    
    Write-Host "  ✓ OpenAPI document ready: $outputPath" -ForegroundColor Green
    return $outputPath
}

# Fix generated code (remove EndPoints references if needed)
function Fix-GeneratedCode($projectDir) {
    Write-Host "Analyzing generated code..." -ForegroundColor Cyan
    
    $endPointsDir = Join-Path $projectDir "EndPoints"
    $hasEndPoints = (Test-Path $endPointsDir) -and ((Get-ChildItem $endPointsDir -Filter "*.cs" -ErrorAction SilentlyContinue).Count -gt 0)
    
    if ($hasEndPoints) {
        $fileCount = (Get-ChildItem $endPointsDir -Filter "*.cs").Count
        Write-Host "  ✓ EndPoints folder has $fileCount file(s) - all good!" -ForegroundColor Green
        return
    }
    
    Write-Host "  ⚠ EndPoints folder is empty - removing broken references..." -ForegroundColor Yellow
    
    # Fix all C# files
    $csFiles = Get-ChildItem $projectDir -Filter "*.cs" -File
    $fixedCount = 0
    
    foreach ($file in $csFiles) {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        
        # Remove using statements for EndPoints
        $content = $content -replace 'using\s+[\w\.]+\.EndPoints;\s*(\r?\n)?', ''
        
        if ($content -ne $originalContent) {
            Set-Content $file.FullName -Value $content -NoNewline
            Write-Host "    ✓ Fixed: $($file.Name)" -ForegroundColor Green
            $fixedCount++
        }
    }
    
    if ($fixedCount -gt 0) {
        Write-Host "  ✓ Fixed $fixedCount file(s)" -ForegroundColor Green
    }
}

# Fix .csproj to avoid duplicate compile issues
function Fix-CsprojIncludes($csprojPath) {
    Write-Host "Configuring .csproj..." -ForegroundColor Cyan

    [xml]$projXml = Get-Content $csprojPath

    # Check if there are explicit Compile items
    $compileItemGroups = $projXml.Project.ItemGroup | Where-Object { $_.Compile -ne $null }
    $hasExplicitCompiles = $compileItemGroups -and ($compileItemGroups.Compile.Count -gt 0)

    if ($hasExplicitCompiles) {
        Write-Host "  Found explicit Compile items - setting EnableDefaultCompileItems=false" -ForegroundColor Gray
        
        $propGroup = $projXml.Project.PropertyGroup | Select-Object -First 1
        if (-not $propGroup) {
            $propGroup = $projXml.CreateElement("PropertyGroup")
            $projXml.Project.AppendChild($propGroup) | Out-Null
        }
        
        $enableDefault = $propGroup.EnableDefaultCompileItems
        if ($enableDefault) {
            $enableDefault.'#text' = 'false'
        } else {
            $elem = $projXml.CreateElement("EnableDefaultCompileItems")
            $elem.InnerText = 'false'
            $propGroup.AppendChild($elem) | Out-Null
        }
        
        $projXml.Save($csprojPath)
        Write-Host "  ✓ Configuration updated" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Using SDK default file inclusion" -ForegroundColor Green
    }
}

# Normalize Project Path
function Get-NormalizedProjectPath {
    if (Test-Path $ProjectFilePath -PathType Leaf) { return $ProjectFilePath }
    if (Test-Path $ProjectFilePath -PathType Container) {
        $proj = Get-ChildItem $ProjectFilePath -Filter "*.csproj" | Select-Object -First 1
        if (!$proj) { throw "No .csproj found in directory: $ProjectFilePath" }
        return $proj.FullName
    }
    return $ProjectFilePath
}

# Get WebAPI JSON path
function Get-WebApiPath {
    if ($WebApiJsonPath) { return $WebApiJsonPath }
    $dir = Split-Path $ProjectFilePath
    $paths = @("webapi.json","swagger.json","openapi.json") | ForEach-Object { Join-Path $dir $_ }
    foreach ($p in $paths) { if (Test-Path $p) { return $p } }
    return Join-Path $dir "webapi.json"
}

# Determine RestClient Name
function Get-RestRestClientName {
    if ($ApiName) { return $ApiName + ".RestClient" }
    $xml = [xml](Get-Content $ProjectFilePath)
    $ns = $xml.Project.PropertyGroup.RootNamespace
    if ($ns) { return $ns.Trim() + ".RestClient" }
    return ([System.IO.Path]::GetFileNameWithoutExtension($ProjectFilePath) + ".RestClient")
}

# Determine Project Version
function Get-ProjectVersion {
    if ($Version) { return $Version }
    $xml = [xml](Get-Content $ProjectFilePath)
    $ver = $xml.Project.PropertyGroup.Version
    return if ($ver) { $ver.Trim() } else { "1.0.0" }
}

# Build OpenAPI Generator
function Build-OpenApiGenerator($dir, $csproj) {
    Write-Section "Building OpenAPI Generator"
    if (!(Test-Path $csproj)) { throw "ERROR: OpenAPI Generator project not found: $csproj" }
    $out = Join-Path $dir "bin"
    if (Test-Path $out) { Remove-Item $out -Recurse -Force }
    dotnet publish $csproj -c Release --output $out -v minimal
    $exe = Join-Path $out 'SoftPro.Tools.Console.OpenApiGenerator.exe'
    if (!(Test-Path $exe)) { throw "ERROR: Build succeeded but executable not found: $exe" }
    return $exe
}

# Generate RestClient
function Invoke-GenerateClient($exe, $dest, $name, $openApiJson, $version) {
    Write-Section "Generating RestClient Code"

    # Convert to absolute path
    $destAbsolute = $dest
    if (-not [System.IO.Path]::IsPathRooted($dest)) {
        $destAbsolute = Join-Path (Get-Location).Path $dest
        $destAbsolute = [System.IO.Path]::GetFullPath($destAbsolute)
    }

    if (!(Test-Path $destAbsolute)) { 
        New-Item -ItemType Directory -Path $destAbsolute -Force | Out-Null 
        Write-Host "Created directory: $destAbsolute" -ForegroundColor Cyan
    }

    # Generate the RestClient
    Write-Host "Executing OpenAPI Generator..." -ForegroundColor Cyan
    Start-Process -FilePath $exe `
        -ArgumentList '--name', $name, '--openapi', $openApiJson, '--version', $version, '--output', $destAbsolute `
        -Wait -NoNewWindow

    $csprojPath = Join-Path $destAbsolute ($name + ".csproj")
    if (!(Test-Path $csprojPath)) {
        throw "ERROR: Expected .csproj file not found: $csprojPath"
    }

    Write-Host "✓ RestClient sources generated" -ForegroundColor Green

    # Fix any issues with the generated code
    Fix-GeneratedCode -projectDir $destAbsolute

    # Fix .csproj configuration
    Fix-CsprojIncludes -csprojPath $csprojPath

    # Build the project
    Write-Host ""
    Write-Host "Building RestClient project..." -ForegroundColor Cyan
    $buildOutput = dotnet build $csprojPath --configuration Release -v minimal 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "  BUILD FAILED" -ForegroundColor Red
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Yellow
        throw "Build failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "✓ Build completed successfully!" -ForegroundColor Green

    # Copy NuGet package to SoftPro NuGet Server
    Write-Host ""
    Write-Host "Deploying NuGet package..." -ForegroundColor Cyan
    $nugetName = Join-Path $destAbsolute ($name + '.' + $version + '.nupkg')
    $nugetServerPath = '..\..\..\..\..\..\Sites\SoftProNuGetWebServer\Packages'
    
    if (Test-Path $nugetName) {
        if (!(Test-Path $nugetServerPath)) {
            Write-Host "⚠ Warning: NuGet server path not found: $nugetServerPath" -ForegroundColor Yellow
            Write-Host "  Creating directory..." -ForegroundColor Yellow
            New-Item -ItemType Directory -Path $nugetServerPath -Force | Out-Null
        }
        
        Copy-Item -Path $nugetName -Destination $nugetServerPath -Force
        Write-Host "✓ Package $nugetName copied to NuGet server" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: NuGet package not found: $nugetName" -ForegroundColor Yellow
        Write-Host "  The package may not have been created during the build." -ForegroundColor Yellow
    }

    return $destAbsolute
}

# Main execution
function Invoke-GenerateRestClient() {
    try {
        $ProjectFilePath = Get-NormalizedProjectPath
        $WebApiJsonPath = Get-WebApiPath
        
        # Resolve DestPath to absolute
        $DestPathAbsolute = $DestPath
        if (-not [System.IO.Path]::IsPathRooted($DestPath)) {
            $DestPathAbsolute = Join-Path (Get-Location).Path $DestPath
            $DestPathAbsolute = [System.IO.Path]::GetFullPath($DestPathAbsolute)
        }
        
        $RestClientDestPath = Join-Path $DestPathAbsolute ($ApiName + '.RestClient')
        $RestClientName = Get-RestRestClientName
        $RestClientVersion = Get-ProjectVersion

        Write-Section "🎯 RestClient Generation Configuration"
        Write-Host " Project file path       => $ProjectFilePath"
        Write-Host " WebApiJson file path    => $WebApiJsonPath"
        Write-Host " RestClient destination  => $RestClientDestPath"
        Write-Host " RestClient Name         => $RestClientName"
        Write-Host " RestClient Version      => $RestClientVersion"

        if (!(Test-Path $ProjectFilePath)) { 
            throw "ERROR: Project file not found: $ProjectFilePath" 
        }

        # 🔥 NUCLEAR OPTION: Generate fresh OpenAPI from running WebAPI
        Write-Host ""
        Write-Host "Checking OpenAPI document..." -ForegroundColor Cyan
        
        $shouldRegenerate = $true
        if (Test-Path $WebApiJsonPath) {
            $existingContent = Get-Content $WebApiJsonPath -Raw | ConvertFrom-Json
            if ($existingContent.paths -and ($existingContent.paths | Get-Member -MemberType NoteProperty).Count -gt 0) {
                Write-Host "Existing OpenAPI has paths - you can use it or regenerate." -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Do you want to regenerate OpenAPI from running WebAPI? (Y/N)" -ForegroundColor Cyan
                $response = Read-Host
                $shouldRegenerate = ($response -eq 'Y' -or $response -eq 'y')
            }
        }
        
        if ($shouldRegenerate) {
            $WebApiJsonPath = Generate-OpenApiFromRunningWebApi $ProjectFilePath $WebApiJsonPath
        }

        # Detect OpenAPI Generator
        $openApiLocalDir = "..\..\..\..\..\..\Outils\OpenApiGenerator\"
        $openApiSources = Join-Path $openApiLocalDir "SoftPro.Tools.Console.OpenApiGenerator.csproj"
        $possibleFrameworks = @('net9.0','net8.0','net7.0','net6.0','netcoreapp3.1')
        $openApiExe = $null
        foreach ($fw in $possibleFrameworks) {
            $testPath = Join-Path $openApiLocalDir "src\SoftPro.Tools.Console.OpenApiGenerator\bin\Release\$fw\SoftPro.Tools.Console.OpenApiGenerator.exe"
            if (Test-Path $testPath) { $openApiExe = $testPath; break }
        }
        if (!$openApiExe -or !(Test-Path $openApiExe)) { 
            $openApiExe = Build-OpenApiGenerator $openApiLocalDir $openApiSources 
        }

        # Generate RestClient
        $restClientDir = Invoke-GenerateClient $openApiExe $RestClientDestPath $RestClientName $WebApiJsonPath $RestClientVersion

        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  🎉 SUCCESS: RestClient Generated Successfully!" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "📁 Location: $restClientDir" -ForegroundColor Cyan
        Write-Host ""

        # Check EndPoints folder status
        $endPointsDir = Join-Path $restClientDir "EndPoints"
        if (Test-Path $endPointsDir) {
            $endPointFiles = Get-ChildItem $endPointsDir -Filter "*.cs" -ErrorAction SilentlyContinue
            Write-Host "📊 Statistics:" -ForegroundColor Cyan
            Write-Host "   Endpoint classes generated: $($endPointFiles.Count)" -ForegroundColor White
            
            if ($endPointFiles.Count -eq 0) {
                Write-Host ""
                Write-Host "⚠️  WARNING: No endpoint classes were generated!" -ForegroundColor Yellow
                Write-Host "   This usually means the OpenAPI/Swagger JSON has no paths defined." -ForegroundColor Yellow
                Write-Host "   Check your webapi.json to ensure it contains your API endpoints." -ForegroundColor Yellow
            }
        }

        Write-Host ""
        # Open folder
        if ($restClientDir -and (Test-Path $restClientDir)) {
            Write-Host "Opening folder in Explorer..." -ForegroundColor Green
            Invoke-Item $restClientDir
        }
    }
    catch {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host "  ✗ FATAL ERROR" -ForegroundColor Red
        Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Red
        Write-Host ""
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Stack Trace:" -ForegroundColor Yellow
        Write-Host $_.ScriptStackTrace -ForegroundColor Yellow
        exit 1
    }
}

# Start
Invoke-GenerateRestClient