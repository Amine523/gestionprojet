using NJsonSchema;
using NJsonSchema.CodeGeneration.CSharp;
using NJsonSchema.CodeGeneration.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class SoftProClassTemplateModel : NJsonSchema.CodeGeneration.CSharp.Models.ClassTemplateModel
    {
        private readonly JsonSchema _schema;
        private readonly CSharpTypeResolver _resolver;
        private readonly CSharpGeneratorSettings _settings;

        public SoftProClassTemplateModel(string typeName, CSharpGeneratorSettings settings, CSharpTypeResolver resolver, JsonSchema schema, object rootObject) : base(typeName, settings, resolver, schema, rootObject)
        {
            // Parcourir les proprietés 
            // Trouver du oneof et les remplacer par le type parent 
            _schema = schema;
            _resolver = resolver;
            _settings = settings;

            Properties = _schema.ActualProperties.Values
                .Where(p => !p.IsInheritanceDiscriminator)
                .Select(property => new SoftProPropertyModel(this, property, _resolver, _settings))
                .ToArray();

        }

        public new IEnumerable<PropertyModel> Properties { get; set; }
    }
}
