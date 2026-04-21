#Chemin vers la racine du générateur
$THIS_SCRIPTS_DIRECTORY_PATH = Split-Path $script:MyInvocation.MyCommand.Path
$OpenApiGeneratorDirectoryPath = resolve-path (join-path $THIS_SCRIPTS_DIRECTORY_PATH "../../")

Import-Module $OpenApiGeneratorDirectoryPath/scripts/generate-source.psm1

#Chemin projets 
$RestClientPath = join-path $OpenApiGeneratorDirectoryPath "typescript-angular/exemple/RestClient"
$WebApiFilePath = join-path $OpenApiGeneratorDirectoryPath "typescript-angular/exemple/webapi.json"

# appel commande
Invoke-GenerateRestClient $OpenApiGeneratorDirectoryPath $WebApiFilePath "@ociane/example-api-client" "1.0.0" $RestClientPath "typescript-angular"
