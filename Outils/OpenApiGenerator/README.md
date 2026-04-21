# Introduction 

Ce projet à pour but de stocker les artefacts nécessaire à nos piles de génération de code autour d'OpenAPI tools

# Bien démarrer

1. Clonez ce dépôt
2. Executez le générateur dont vous avez besoin en lancant une des commandes : 
    - Generate-Dotnet-RestClient.ps1
    - Generate-Angular-RestClient.ps1
    - Generate-Dotnet-WebApi.ps1

# Débugger
Quand le client REST ne se génère pas correctement dans le pipeline, il est nécessaire de lancer la génération REST en local pour identifier le problème.

## Générer le webapi.json de l'API
- Récupérer dans Visual Studio le code de l'API pour laquelle on veut générer le client REST
- Compiler l'API pour générer le fichier webapi.json

## Débugagge du projet Open API Generator
Ce premier niveau de débuggage consiste à lancer le générateur en mode debug pour faire du pas à pas.
- Récupérer le code du générateur dans Visual Studio :
  - https://devops.intra.ociane.fr/DefaultCollection/Ociane.Tools/_git/Ociane.Tools.OpenApiGenerator
- Définir les arguments d'exécution :
  - Ouvrir les propriétés du projet "Ociane.Tools.Console.OpenApiGenerator" et sélectionner l'onglet "Déboguer"
  - Dans la zone "Arguments", définir les paramètres d'exécution (sans retour à la ligne) :
`--name <NomClientRest> --openapi <CheminWebApi> --version <versionPackage> --output <CheminProjetClient>`

### Exemple 
`--name "Ociane.Api.ApiDevisPrestation.RestClient" --openapi "C:\Users\cuquemelle.g.ext\source\repos\ApiDevisPrestation\src\Ociane.Api.ApiDevisPrestation\webapi.json" --version "1.2.3" --output "c:\temp\Rest.Client"`

## Tester le script de génération
Ce test permet de valider le fonctionnement de la génération dans des conditions proches de l'exécution depuis un pipeline.

### Compiler le générateur
- Récupérer le code du générateur dans Visual Studio :
  - https://devops.intra.ociane.fr/DefaultCollection/Ociane.Tools/_git/Ociane.Tools.OpenApiGenerator
- Compiler le générateur :
  - l'exécutable du générateur est créé dans le dossier :
    - src\Ociane.Tools.Console.OpenApiGenerator\bin\Debug\netcoreapp3.1

### Exécution du script de génération
- Ouvrir une console Powershell
- Se positionner dans le dossier projet du générateur :
  - cd C:\Users\cuquemelle.g.ext\source\repos\Ociane.Tools.OpenApiGenerator
- Lancer la génération :
  - scripts/create-sources-and-nuget-pipeline.ps1 -ProjectFilePath <cheminProjet> -DestPath <RestClient> -GitPush $false -OpenApiGeneratorExe <cheminExeGenerateur>
  - cheminProjet : chemin du fichier csproj
  - RestClient : dossier pour générer le projet de client REST
  - cheminExeGenerateur : emplacement de l'exécutable du générateur

#### Exemple avec un build en échec
scripts/create-sources-and-nuget-pipeline.ps1 -ProjectFilePath C:\Users\cuquemelle.g.ext\source\repos\ApiTiersPayantPharmacie\src\Ociane.ApiTiersPayantPharmacie.Api/Ociane.ApiTiersPayantPharmacie.Api.csproj -DestPath c:\temp\Rest.Client -GitPush $false -OpenApiGeneratorExe src\Ociane.Tools.Console.OpenApiGenerator\bin\Debug\netcoreapp3.1/Ociane.Tools.Console.OpenApiGenerator.exe

#### Exemple avec un build réussi
scripts/create-sources-and-nuget-pipeline.ps1 -ProjectFilePath C:\Users\cuquemelle.g.ext\source\repos\Ociane.Api.Template\src\Ociane.Api.Template.WebApi/Ociane.Api.Template.WebApi.csproj -DestPath c:\temp\Rest.Client -GitPush $false -OpenApiGeneratorExe src\Ociane.Tools.Console.OpenApiGenerator\bin\Debug\netcoreapp3.1/Ociane.Tools.Console.OpenApiGenerator.exe

## Débugagge du projet de client REST généré
- Ouvrir la solution Visual Studio créée à l'étape précédente dans le dossier où le projet de client REST a été généré
- Compiler la solution pour afficher les erreurs

# Contribution

Contactez l'équipe d'architecture/conception/devops pour plus d'informations