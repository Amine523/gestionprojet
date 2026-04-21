[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)]
  [String]$ProjectFilePath,

  [Parameter(Mandatory=$true)]
  [String]$Outputdirectory

)

#Chemin vers la racine du générateur
$OpenApiGeneratorDirectoryPath = Split-Path $script:MyInvocation.MyCommand.Path

Import-Module $OpenApiGeneratorDirectoryPath/scripts/generate-source.psm1

# appel commande
Invoke-GenerateSource -CsProjFilePath $ProjectFilePath -RestClientPath $Outputdirectory -OpenApiGeneratorDirectoryPath $OpenApiGeneratorDirectoryPath