using NJsonSchema;
using NJsonSchema.CodeGeneration;
using NJsonSchema.CodeGeneration.CSharp;
using NSwag;
using NSwag.CodeGeneration;
using NSwag.CodeGeneration.CSharp;
using NSwag.CodeGeneration.CSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SoftPro.Tools.Console.OpenApiGenerator.TemplateModel
{
    public class SoftProCSharpOperationModel : CSharpOperationModel
    {
        private readonly OpenApiOperation _operation;
        private readonly CSharpTypeResolver _resolver;
        private readonly IClientGenerator _generator;
        private readonly ClientGeneratorBaseSettings _settings;

        public SoftProCSharpOperationModel(OpenApiOperation operation, CSharpGeneratorBaseSettings settings, CSharpGeneratorBase generator, CSharpTypeResolver resolver) : base(operation, settings, generator, resolver)
        {
            _operation = operation;
            _resolver = resolver;
            _generator = generator;
            _settings = settings;

            Parameters = operation.Parameters
                .Select(parameter =>
                    new CSharpParameterModel(
                        parameter.Name,
                        GetParameterVariableName(parameter, _operation.Parameters),
                        GetParameterVariableIdentifier(parameter, _operation.Parameters),
                        ResolveParameterTypeOneOf(parameter), parameter, operation.Parameters,
                        _settings.CodeGeneratorSettings,
                        _generator,
                        _resolver))
                .ToList();

            ConfigureOneOfResulType();
        }

        protected string ResolveParameterTypeOneOf(OpenApiParameter parameter)
        {
            JsonSchema schema = parameter.Schema;
            if (schema?.OneOf == null || schema?.OneOf.Count < 2) return base.ResolveParameterType(parameter);

            return GetParentType(schema.OneOf);
        }

        public bool IsOneOf { get; set; } = false;

        public string ReturnTypeConstraint { get; set; }


        private void ConfigureOneOfResulType()
        {
            if (!_operation.ActualResponses.ContainsKey("200")) return;

            OpenApiResponse openApiResponse = _operation.ActualResponses.First(p => p.Key == "200").Value;

            if (openApiResponse.Schema == null) return;

            JsonSchema schema = openApiResponse.Schema;

            if (schema.OneOf == null || schema.OneOf.Count < 2) return;

            IsOneOf = true;

            ReturnTypeConstraint = GetReturnTypeConstraint(schema.OneOf);
        }


        private string GetReturnTypeConstraint(ICollection<JsonSchema> oneOf)
        {
            string parentType = GetParentType(oneOf);
            if (string.IsNullOrEmpty(parentType)) return null;

            return $" where T : {parentType}";

        }

        private string GetParentType(ICollection<JsonSchema> schemas)
        {
            foreach (JsonSchema oneOfSchema in schemas)
            {
                if (oneOfSchema.ActualSchema.AllOf != null) return _resolver.GetOrGenerateTypeName(oneOfSchema.ActualSchema.AllOf.First(), null);
            }
            return null;
        }

        public new string SyncResultType
        {
            get
            {
                if (_settings != null && WrapResponse && UnwrappedResultType != "FileResponse")
                {
                    return UnwrappedResultType == "void"
                        ? _settings.ResponseClass.Replace("{controller}", ControllerName)
                        : _settings.ResponseClass.Replace("{controller}", ControllerName) + "<" + UnwrappedResultType + ">";
                }

                return UnwrappedResultType;
            }
        }


        public override string ResultType
        {
            get
            {
                return SyncResultType == "void"
                    ? "System.Threading.Tasks.Task<SoftProRestResponse>"
                    : "System.Threading.Tasks.Task<" + SyncResultType + ">";
            }
        }


        public new string UnwrappedResultType
        {
            get
            {
                if (IsOneOf) return "T";

                var response = GetSuccessResponse();
                if (response.Value == null || response.Value.IsEmpty(_operation))
                {
                    return "SoftProRestResponse";
                }

                if (response.Value.IsBinary(_operation) == true)
                {
                    return _generator.GetBinaryResponseTypeName();
                }

                var isNullable = response.Value.IsNullable(_settings.CodeGeneratorSettings.SchemaType);
                var schemaHasTypeNameTitle = response.Value.Schema?.HasTypeNameTitle;
                var hint = schemaHasTypeNameTitle != true ? "Response" : null;
                string typeName = _generator.GetTypeName(response.Value.Schema, isNullable, hint);

                if (typeName == "byte[]") return "FileResponse";

                return typeName;
            }
        }
    }
}
