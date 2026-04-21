using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    /// <summary>
    /// Classe contenant les informations nécessaire a la génération du MockHelper.cs
    /// </summary>
    public class MockHelperTemplateModel
    {

        public string NameSpace { get; private set; }

        public MockHelperTemplateModel(SoftProCsharpClientGeneratorSettings settings)
        {
            NameSpace = $"{settings.CSharpGeneratorSettings.Namespace}.Shared";
        }
    }
}
