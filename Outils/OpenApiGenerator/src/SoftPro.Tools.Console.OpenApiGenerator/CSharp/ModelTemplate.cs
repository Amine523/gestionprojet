using NJsonSchema.CodeGeneration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    /// <summary>
    /// Modele contenant les informations pour générer une classe modele
    /// </summary>
    public class ModelTemplate
    {
        public ModelTemplate(CodeArtifact codeArtifact, SoftProCsharpClientGeneratorSettings settings)
        {
            RootNameSpace = settings.CSharpGeneratorSettings.Namespace;
            ModelsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Models";
            EndPointsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.EndPoints";
            SharedNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
            Class = codeArtifact.TypeName;
            Code = codeArtifact.Code;
        }


        public string RootNameSpace { get; set; }

        public string ModelsNameSpace { get; set; }

        public string EndPointsNameSpace { get; set; }

        public string SharedNameSpace { get; set; }

        public string Code { get; set; }

        public string Class { get; set; }
    }
}
