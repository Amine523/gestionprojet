# Get Command Line Parameters
param (
    [Parameter(Mandatory=$true)]
    [string]$ApiName, 
    [Parameter(Mandatory=$true)]
	[ValidateSet('Debug','Release')]
    [string]$BuildMode = 'Debug',
    [Parameter(Mandatory=$true)]
    [string]$DestPath,
    [Parameter(Mandatory=$false)]
    [string]$SourceProjectFileName
)

$ErrorActionPreference = "Stop"

Write-Host 'Starting Publish process, destination : ' $DestPath

# If you place the psm1 file in the global PowerShell Modules directory then you could reference it just by name, not by the entire file path like we do here (assumes psm1 file is in same directory as your script).
$THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
$ToolsPath = $THIS_SCRIPTS_DIRECTORY_PATH
write-host 'ToolPath ' + $ToolsPath
$SynchronousZipAndUnzipModulePath = Join-Path $ToolsPath 'Synchronous-ZipAndUnzip.psm1'

# Get Semantic Version info from SVN
Import-Module $ToolsPath\SemVer.psm1
Import-Module $ToolsPath\DotNetCore.psm1
Invoke-SemVer

Write-Host 'Detected version : ' $env:MajorMinorPatch


if(!$SourceProjectFileName)
{
	$SourceProjectFileName='Ociane.Services.' + $ApiName + '.WebApi'
}
$WebApiDllName=$SourceProjectFileName + '.dll'


# Customize this for your workstation
$SourcePath = '../../'
$tmp = [System.IO.Path]::GetRandomFileName() + '/'
$BinariesPath = Join-Path $THIS_SCRIPTS_DIRECTORY_PATH $tmp

# This should not necessitate customisation
$SourceProjectPath = Join-Path $SourcePath 'src'
$SourceProjectFilePath = Join-Path $SourceProjectPath ($SourceProjectFileName + '.csproj')

$BuildPath = Join-Path $BinariesPath $ApiName
$BinaryPath = Join-Path $BuildPath  'bin/'
$DllPath = Join-Path $BinaryPath $WebApiDllName

# Create dirs if necessary (need permissions)

If(!(Test-Path $DestPath)){
    New-Item -ItemType Directory -Force -Path $DestPath
}

$DemandesDestPath = Join-Path $DestPath $ApiName

# Import the Synchronous-ZipAndUnzip module.
Import-Module -Name $SynchronousZipAndUnzipModulePath

# patch version of project file
Invoke-PatchProjectVersion $SourceProjectFilePath $env:MajorMinorPatch

Write-Host 'Patched csproj file (' $SourceProjectFilePath ') with version : ' $env:MajorMinorPatch

# Build API

cd $SourceProjectPath
$cwd = Get-Location
Write-Host 'Publishing project (' $cwd ') to (' $BinaryPath ')'
dotnet publish -c $BuildMode /p:EnvironmentName=Development -o $BinaryPath -r win-x64 --self-contained false 

If ($LastExitCode -ne 0) {
    ####### Something went wrong, exit
    throw 'Error at publish, exiting process';
}

# Get version
$Version =  [System.Diagnostics.FileVersionInfo]::GetVersionInfo($DllPath).FileVersion

Write-Host 'Read back version ' $Version 'after build'

# Build zip filename from env and version
$ZipFileName = $ApiName + '-' + $BuildMode + '-' + $Version + '.zip'
$ZippingPath = Join-Path $BinariesPath $ZipFileName
$ZipDestPath = Join-Path $DestPath $ZipFileName

Compress-ZipFile -ZipFilePath $ZippingPath -FileOrDirectoryPathToAddToZipFile $BinaryPath -OverwriteWithoutPrompting

Write-Host 'Zip files produced to : ' + $BinariesPath

# Cleanup existing binaries and copy new binaries to delivery location
Remove-Item $ZipDestPath -ErrorAction SilentlyContinue -Force 

Copy-Item -Path $ZippingPath -Destination $DestPath -Recurse -Force

# Cleanup
Remove-Item $BinariesPath -Recurse -Force 

# Congratulate
Write-Host 'Binaries transfered to : ' + $DestPath
