using NJsonSchema.CodeGeneration;
using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class ApiClassTemplateModel
    {
        public ApiClassTemplateModel(SoftProCsharpClientGeneratorSettings settings, string className, IEnumerable<CodeArtifact> endPoints)
        {
            RootNameSpace = settings.CSharpGeneratorSettings.Namespace;
            ModelsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Models";
            EndPointsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.EndPoints";
            SharedNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
            ClassName = className;
            //MockClassName = $"Mock{className}";
            EndPoints = CreateEndPoint(endPoints); 
            InterfaceClassName = $"I{className}";
        }

        private List<EndPointModel> CreateEndPoint(IEnumerable<CodeArtifact> endPoints)
        {
            List<EndPointModel> results = new List<EndPointModel>();

            IEnumerable<string> typeNames = endPoints?.Where(p => p.Category == CodeArtifactCategory.Client).Select(p => p.TypeName);

            foreach (string typeName in typeNames)
            {
                results.Add(new EndPointModel()
                {
                    InterfaceType = $"I{typeName}",
                    EndpointType = typeName,
                    //MockType = $"Mock{typeName}",
                    PropertyName = typeName

                });
            }

            return results;
        }

        public string RootNameSpace { get; set; }

        public string ModelsNameSpace { get; set; }

        public string EndPointsNameSpace { get; set; }

        public string SharedNameSpace { get; set; }

        public string ClassName { get; set; }

        //public string MockClassName { get; set; }

        public string InterfaceClassName { get; set; }

        public List<EndPointModel> EndPoints { get; set; }
    }

}
