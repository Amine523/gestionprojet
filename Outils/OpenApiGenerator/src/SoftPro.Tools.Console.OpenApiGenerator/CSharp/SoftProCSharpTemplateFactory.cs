using NJsonSchema.CodeGeneration;
using NSwag.CodeGeneration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    public class SoftProCSharpTemplateFactory : NSwag.CodeGeneration.DefaultTemplateFactory
    {
        /// <summary>Initializes a new instance of the <see cref="DefaultTemplateFactory" /> class.</summary>
        /// <param name="settings">The settings.</param>
        /// <param name="assemblies">The assemblies.</param>
        public SoftProCSharpTemplateFactory(CodeGeneratorSettingsBase settings, Assembly[] assemblies)
            : base(settings, assemblies)
        {
        }

        protected override string GetEmbeddedLiquidTemplate(string language, string template)
        {
            template = template.TrimEnd('!');
            var assembly = typeof(SoftProCSharpTemplateFactory).GetTypeInfo().Assembly;// GetLiquidAssembly("NSwag.CodeGeneration." + language);
            var resourceName = "SoftPro.Tools.Console.OpenApiGenerator.Templates." + template + ".liquid";

            var resource = assembly.GetManifestResourceStream(resourceName);
            if (resource != null)
            {
                using (var reader = new StreamReader(resource))
                {
                    return reader.ReadToEnd();
                }
            }

            return base.GetEmbeddedLiquidTemplate(language, template);
        }
    }
}
