using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class SoftProRestResponseTemplateModel
    {
        public string NameSpace { get; private set; }

        public SoftProRestResponseTemplateModel(SoftProCsharpClientGeneratorSettings settings)
        {
            NameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
        }
    }
}
