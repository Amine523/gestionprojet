[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [String]$OpenApiFilePath,

  [Parameter(Mandatory=$true)]
  [String]$PackageName,

  [Parameter(Mandatory=$true)]
  [String]$PackageVersion,

  [Parameter(Mandatory=$true)]
  [String]$Outputdirectory

)

#Chemin vers la racine du générateur
$OpenApiGeneratorDirectoryPath = Split-Path $script:MyInvocation.MyCommand.Path

Import-Module $OpenApiGeneratorDirectoryPath/scripts/generate-source.psm1

# appel commande
Invoke-GenerateServer $OpenApiGeneratorDirectoryPath $OpenApiFilePath $PackageName $PackageVersion $Outputdirectory "aspnetcore"

