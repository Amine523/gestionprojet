using NJsonSchema;
using NJsonSchema.CodeGeneration;
using NJsonSchema.CodeGeneration.CSharp;
using SoftPro.Tools.Console.OpenApiGenerator.TemplateModel;
using System.Collections.Generic;
using System.Linq;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    public class SoftProCSharpGenerator : CSharpGenerator
    {
        private readonly CSharpTypeResolver _resolver;

        public SoftProCSharpGenerator(object rootObject, CSharpGeneratorSettings settings, CSharpTypeResolver resolver) : base(rootObject, settings, resolver)
        {
            _resolver = resolver;
        }

        /// <summary>Generates the type.</summary>
        /// <param name="schema">The schema.</param>
        /// <param name="typeNameHint">The type name hint.</param>
        /// <returns>The code.</returns>
        protected override CodeArtifact GenerateType(JsonSchema schema, string typeNameHint)
        {
            var typeName = _resolver.GetOrGenerateTypeName(schema, typeNameHint);

            if (schema.IsEnumeration)
            {
                return GenerateEnum(schema, typeName);
            }
            else
            {
                return GenerateClass(schema, typeName);
            }
        }

        private CodeArtifact GenerateEnum(JsonSchema schema, string typeName)
        {
            var model = new SoftProEnumTemplateModel(typeName, schema, Settings);
            var template = Settings.TemplateFactory.CreateTemplate("CSharp", "Enum", model);
            return new CodeArtifact(typeName, CodeArtifactType.Enum, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, template);
        }


        private CodeArtifact GenerateClass(JsonSchema schema, string typeName)
        {
            var model = new SoftProClassTemplateModel(typeName, Settings, _resolver, schema, RootObject);

            RenamePropertyWithSameNameAsClass(typeName, model.Properties);

            var template = Settings.TemplateFactory.CreateTemplate("CSharp", "Class", model);
            return new CodeArtifact(typeName, model.BaseClassName, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, template);
        }



        private static void RenamePropertyWithSameNameAsClass(string typeName, IEnumerable<NJsonSchema.CodeGeneration.CSharp.Models.PropertyModel> properties)
        {
            var propertyModels = properties as NJsonSchema.CodeGeneration.CSharp.Models.PropertyModel[] ?? properties.ToArray();
            NJsonSchema.CodeGeneration.CSharp.Models.PropertyModel propertyWithSameNameAsClass = null;
            foreach (var p in propertyModels)
            {
                if (p.PropertyName == typeName)
                {
                    propertyWithSameNameAsClass = p;
                    break;
                }
            }

            if (propertyWithSameNameAsClass != null)
            {
                var number = 1;
                var candidate = typeName + number;
                while (propertyModels.Any(p => p.PropertyName == candidate))
                {
                    number++;
                }

                propertyWithSameNameAsClass.PropertyName = propertyWithSameNameAsClass.PropertyName + number;
            }
        }
    }
}
