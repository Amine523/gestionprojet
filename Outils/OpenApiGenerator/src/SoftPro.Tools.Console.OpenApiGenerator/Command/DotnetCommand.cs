using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.Command
{
    public class DotnetCommand
    {
        public static string CreateSolution(object name, string directory, string csprojFilePath)
        {
            string slnPath = Path.Combine(directory, $"{name}.sln"); 

            Dotnet($"new sln -n {name} -o {directory} --force");
            Dotnet($"sln {slnPath} add {csprojFilePath}");

            return slnPath;
        }

        public static void Compile(string csProjFilePath)
        {
            var command = $"build \"{csProjFilePath}\" --configuration Release";
            Dotnet(command);
        }

        public static void PackRelease(string csProjFilePath, string outputDirectory, string version)
        {
            var command = $"pack \"{csProjFilePath}\" --configuration Release -p:PackageVersion={version} --output \"{outputDirectory}\"";
            Dotnet(command);
            var nuget = Path.Combine(outputDirectory, $"{Path.GetFileNameWithoutExtension(csProjFilePath)}.{version}.nupkg");
            System.Console.WriteLine($"Package NuGet généré => {nuget}");
        }

        public static void PushNuGet(string nextVersionFilePath)
        {
            Dotnet($"nuget push -s deveops n -k Cle {nextVersionFilePath}");
        }

        private static void Dotnet(string arguments)
        {
            System.Console.WriteLine($"dotnet {arguments}");
            var process = new Process()
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = arguments,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    ErrorDialog = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            string output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            System.Console.WriteLine(output);
            if (process.ExitCode != 0)
            {
                System.Console.WriteLine($"Exit code : {process.ExitCode}");
                Environment.Exit(process.ExitCode);
            }
        }
    }
}

