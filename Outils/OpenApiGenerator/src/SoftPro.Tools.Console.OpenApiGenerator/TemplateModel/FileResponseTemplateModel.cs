using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class FileResponseTemplateModel
    {
        public string NameSpace { get; private set; }

        public FileResponseTemplateModel(SoftProCsharpClientGeneratorSettings settings)
        {
            NameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
        }
    }
}
