#Chemin vers la racine du générateur
$THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
$OpenApiGeneratorDirectoryPath = resolve-path (join-path $THIS_SCRIPTS_DIRECTORY_PATH "../../")

Import-Module $OpenApiGeneratorDirectoryPath/scripts/generate-source.psm1

#Chemin projets 
$WebApiServerPath = join-path $OpenApiGeneratorDirectoryPath "aspnetcore/exemple/WebAPI"
$WebApiFilePath = join-path $OpenApiGeneratorDirectoryPath "aspnetcore/exemple/webapi.json"

# appel commande
Invoke-GenerateServer $OpenApiGeneratorDirectoryPath $WebApiFilePath "Ociane.Revolution.ApiDevis" "1.0.0" $WebApiServerPath "aspnetcore"
