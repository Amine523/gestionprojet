using NSwag;
using System;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    public class ProjectInfos
    {
        public string Name { get; set; }

        public string Version { get;  set; }

        public OpenApiDocument OpenApiDocument { get; set; }

        public string OutputDirectory { get; set; }

        public String TargetFramework { get; set; }
    }
}
