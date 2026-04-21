using NJsonSchema;
using NJsonSchema.CodeGeneration.CSharp;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class SoftProEnumTemplateModel : NJsonSchema.CodeGeneration.CSharp.Models.EnumTemplateModel
    {
        public SoftProEnumTemplateModel(string typeName, JsonSchema schema, CSharpGeneratorSettings settings): base (typeName, schema, settings)
        {
            Namespace = $"{settings.Namespace}.Models"; 
        }

        public string Namespace { get; set; }
    }
}
