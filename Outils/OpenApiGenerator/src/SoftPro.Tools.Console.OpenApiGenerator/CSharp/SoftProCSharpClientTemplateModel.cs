using NJsonSchema;
using NSwag;
using NSwag.CodeGeneration.CSharp;
using NSwag.CodeGeneration.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    public class SoftProCSharpClientTemplateModel : CSharpClientTemplateModel
    {
        public SoftProCSharpClientTemplateModel(string controllerName, string controllerClassName, IEnumerable<CSharpOperationModel> operations, JsonSchema exceptionSchema, OpenApiDocument document, SoftProCsharpClientGeneratorSettings settings)
        : base(controllerName, controllerClassName, operations, exceptionSchema, document, settings)
        {
            RootNameSpace = settings.CSharpGeneratorSettings.Namespace;
            ModelsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Models";
            EndPointsNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.EndPoints";
            SharedNameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
            InterfaceClassName = $"I{controllerClassName}";
            //MockClassName = $"Mock{controllerClassName}";
           

        }


        public string RootNameSpace { get; set; }

        public string ModelsNameSpace { get; set; }

        public string EndPointsNameSpace { get; set; }

        public string SharedNameSpace { get;  set; }

        public string InterfaceClassName { get; set; }
        //public string MockClassName { get; set; }
    }
}
