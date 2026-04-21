using NJsonSchema.CodeGeneration;
using NSwag;
using SoftPro.Tools.Console.OpenApiGenerator.Command;
using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace SoftPro.Tools.Console.OpenApiGenerator
{
    /// <summary>
    /// TODO: Tester secutilisateur pour les routes qui ne renvoie rien 
    /// Traitements de exception 
    /// 
    /// </summary>
    class Program
    {
        /// <summary>
        /// En entrée sont obligatoires 
        /// --namespace Le nom du namespace racine
        /// --openapi   Le chemin vers le fichier openapi 
        /// --apiname   Le nom de l'api 
        /// --version   La version de l'api
        /// --output    Le dossier 
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        static async Task<int> Main(string[] args)
        {
            // await GenerateExemples();

            System.Console.WriteLine("Executing SoftPro.Tools.Console.OpenApiGenerator");
            ProjectInfos projetInfos = await ParseProjetInfosAsync(args);

            if (!Validate(projetInfos))
            {
                System.Console.Error.WriteLine("La syntaxe de la commande doit etre --name [Nom du Projet] --openapi [chemin vers le webapi.json] --version [Version de l'api] --output [chemin destination] [--targetframework [framework cible]]");
                return 1;
            }

            GenerateRestClient(projetInfos);

            return 0;
        }

        private static bool Validate(ProjectInfos projetInfos)
        {
            if (projetInfos == null || string.IsNullOrEmpty(projetInfos.Name) || string.IsNullOrEmpty(projetInfos.Version)) return false;
            return true;
        }

        private static async Task<ProjectInfos> ParseProjetInfosAsync(string[] args)
        {
            ProjectInfos result = new ProjectInfos();
            result.TargetFramework = "net9.0";

            try
            {
                for (int i = 0; i < args.Length; i++)
                {
                    string command = args[i];

                    if (command == "--name")
                    {
                        result.Name = args[i + 1];
                        System.Console.WriteLine($"[name] : {result.Name}");
                        i++;
                    }

                    if (command == "--openapi")
                    {
                        result.OpenApiDocument = await GetOpenApiDocument(args[i + 1]);
                        System.Console.WriteLine($"[openapi] : {args[i + 1]}");
                        i++;
                    }

                    if (command == "--version")
                    {
                        result.Version = args[i + 1];
                        System.Console.WriteLine($"[version] : {result.Version}");
                        i++;
                    }

                    if (command == "--output")
                    {
                        result.OutputDirectory = args[i + 1];
                        System.Console.WriteLine($"[output] : {result.OutputDirectory}");
                        i++;
                    }

                    if (command == "--targetframework")
                    {
                        result.TargetFramework = args[i + 1];
                        System.Console.WriteLine($"[targetframework] : {result.TargetFramework}");
                        i++;
                    }
                }
            }

            catch
            {
                return null;
            }

            return result;
        }

        private static async Task<OpenApiDocument> GetOpenApiDocument(string openapi)
        {
            if (openapi.StartsWith("http")) return await OpenApiDocument.FromUrlAsync(openapi);
            if(openapi.EndsWith(".json")) return await OpenApiDocument.FromFileAsync(openapi);
            return null;
        }

        /// <summary>
        /// Quelques exemples pour tester 
        /// </summary>
        /// <returns></returns>
        private static async Task GenerateExemples()
        {
            string currentDirectory = Directory.GetCurrentDirectory();
            string webapiFilePath = Path.Combine(currentDirectory, "exemples", "WaCoreClient.json");

            // Qualif doc 
            ProjectInfos qualifDocProjetInfo = new ProjectInfos()
            {
                Version = "2.0.21",
                OpenApiDocument = await OpenApiDocument.FromFileAsync(webapiFilePath),
                Name = "Matmut.WaCoreClient.RestClient",
                OutputDirectory = "D:/NSwag/Matmut.WaCoreClient.RestClient/2.0.21",
                TargetFramework = "net9.0"
            };

            GenerateRestClient(qualifDocProjetInfo);
        }

        private static void GenerateRestClient(ProjectInfos projectInfos)
        {
            // 1. Instanciation du génrateur de client d'api 
            SoftProCsharpClientGenerator generator = new SoftProCsharpClientGenerator(projectInfos.OpenApiDocument, new SoftProCsharpClientGeneratorSettings(projectInfos.Name));

            // 2. Création du dossier de sortie 
            if (!Directory.Exists(projectInfos.OutputDirectory)) Directory.CreateDirectory(projectInfos.OutputDirectory);

            // 3. Création du csproj 
            string csprojContent = generator.GenerateProjectFile(projectInfos);
            string csprojFilePath = CreateFile(projectInfos.OutputDirectory, $"{projectInfos.Name}.csproj", csprojContent);

            // 4. Création des modeles 
            IEnumerable<CodeArtifact> models = generator.GenerateModels();
            CreateFiles(Path.Combine(projectInfos.OutputDirectory, "Models"), models);

            // 5. Création des EndPoints            
            IEnumerable<CodeArtifact> endPoints = generator.GenerateEndPoints();
            CreateFiles(Path.Combine(projectInfos.OutputDirectory, "EndPoints"), endPoints);

            IEnumerable<CodeArtifact> apiClass = generator.GenerateApiClass(CleanName(projectInfos.Name), endPoints);
            CreateFiles(projectInfos.OutputDirectory, apiClass);

            // 6. Créations des classe communes 
            IEnumerable<CodeArtifact> shared = generator.GenerateShared();
            CreateFiles(Path.Combine(projectInfos.OutputDirectory, "Shared"), shared);

            // 7. Création du fichier NuGet.config pour ne récupérer les NuGet que depuis azuredevops
            string nugetConfigContent = generator.GenerateNuGetConfig(projectInfos);
            CreateFile(projectInfos.OutputDirectory, "NuGet.config", nugetConfigContent);

            // 8. Ajout du fichier gitignore si on veut push le code
            string gitignoreContent = generator.GenerateGitIgnore(projectInfos);
            CreateFile(projectInfos.OutputDirectory, ".gitignore", gitignoreContent);

            // 8. Création de la solution
            DotnetCommand.CreateSolution(projectInfos.Name, projectInfos.OutputDirectory, csprojFilePath);

            // 9. Comilation du client REST 
            DotnetCommand.Compile(csprojFilePath);

            // 10. Création du NuGet 
            DotnetCommand.PackRelease(csprojFilePath, projectInfos.OutputDirectory, projectInfos.Version);
            // Nettoyer et déplacer C:\Users\gomez.alexandre1e\.nuget\packages
        }

        private static void CreateFiles(string outputDirectory, IEnumerable<CodeArtifact> codeArtifacts)
        {
            if (!Directory.Exists(outputDirectory)) Directory.CreateDirectory(outputDirectory);

            foreach(CodeArtifact codeArtifact in codeArtifacts)
            {
                string filePath = Path.Combine(outputDirectory, $"{codeArtifact.TypeName}.cs");
                File.WriteAllText(filePath, codeArtifact.Code);
            }
        }

        private static string CreateFile(string outputDirectory, string fileName, string fileContent)
        {
            if (!Directory.Exists(outputDirectory)) Directory.CreateDirectory(outputDirectory);
            string filePath = Path.Combine(outputDirectory, fileName);
            File.WriteAllText(filePath, fileContent);
            return filePath;
        }

        private static string CleanName(string name)
        {
            return name.Replace(".", "");
        }
    }
}
