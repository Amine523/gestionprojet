#Chemin vers la racine du générateur
$THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
$OpenApiGeneratorDirectoryPath = resolve-path (join-path $THIS_SCRIPTS_DIRECTORY_PATH "../../")

Import-Module $OpenApiGeneratorDirectoryPath/scripts/generate-source.psm1

#Chemin projets 
$CsProjFilePath= join-path $OpenApiGeneratorDirectoryPath "**.csproj"
$RestClientFullPath=  join-path $OpenApiGeneratorDirectoryPath "csharp-netcore\exemple\RestClient"

# appel commande
Invoke-GenerateSource -CsProjFilePath $CsProjFilePath -RestClientPath $RestClientFullPath -OpenApiGeneratorDirectoryPath $OpenApiGeneratorDirectoryPath