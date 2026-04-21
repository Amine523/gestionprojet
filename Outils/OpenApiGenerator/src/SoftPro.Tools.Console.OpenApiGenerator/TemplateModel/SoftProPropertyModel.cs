using NJsonSchema;
using NJsonSchema.CodeGeneration.CSharp;
using NJsonSchema.CodeGeneration.CSharp.Models;
using System;
using System.Linq;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class SoftProPropertyModel : PropertyModel
    {
        private readonly SoftProClassTemplateModel _SoftProClassTemplateModel;
        private readonly JsonSchemaProperty _property;
        private readonly CSharpTypeResolver _resolver;
        private readonly CSharpGeneratorSettings _settings;

        public SoftProPropertyModel(SoftProClassTemplateModel SoftProClassTemplateModel, JsonSchemaProperty property, CSharpTypeResolver resolver, CSharpGeneratorSettings settings) : base(SoftProClassTemplateModel, property, resolver, settings)
        {
            _SoftProClassTemplateModel = SoftProClassTemplateModel;
            _property = property;
            _resolver = resolver;
            _settings = settings;

            //if (IsOneOf(property)) Type = "OneOf";
        }

        public new string Type
        {
            get
            {
                if (IsOneOf()) return GetParentType();
                return base.Type;
            }

        }

        private string GetParentType()
        {
            foreach (JsonSchema oneOfSchema in _property.OneOf)
            {
                if (oneOfSchema.ActualSchema.AllOf != null) return _resolver.GetOrGenerateTypeName(oneOfSchema.ActualSchema.AllOf.First(), null);
            }
            return _resolver.GetOrGenerateTypeName(_property.OneOf.First(), null);
        }

        private bool IsOneOf()
        {
            return _property.OneOf != null && _property.OneOf.Count > 1;
        }
    }
}
