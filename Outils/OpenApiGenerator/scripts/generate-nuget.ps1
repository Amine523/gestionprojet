Param (
    [Parameter(Mandatory=$true)]
    $ProjectPath,
    [Parameter(Mandatory=$true)]
    $RestClientPath
  )

$THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path

$CsProjFilePath = join-path  $env:BUILD_SOURCESDIRECTORY $ProjectPath
$RestClientFullPath = join-path  $env:BUILD_SOURCESDIRECTORY $RestClientPath
$OpenApiGeneratorDirectoryPath = resolve-path (join-path $THIS_SCRIPTS_DIRECTORY_PATH "../")

Import-Module $THIS_SCRIPTS_DIRECTORY_PATH/generate-source.psm1
Import-Module $THIS_SCRIPTS_DIRECTORY_PATH/depot-nuget.psm1

# 1. Génération des sources .NET du client Rest 
Invoke-GenerateSource -CsProjFilePath $CsProjFilePath -RestClientPath $RestClientFullPath -OpenApiGeneratorDirectoryPath $OpenApiGeneratorDirectoryPath

# 2. Packaging NuGet et dépot de l'artifact sur Azure Ociane
Invoke-DeposerNuget -RestClientSourcePath $RestClientFullPath