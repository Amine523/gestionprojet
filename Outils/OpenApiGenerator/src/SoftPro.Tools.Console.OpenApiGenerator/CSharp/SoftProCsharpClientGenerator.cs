using NJsonSchema.CodeGeneration;
using NJsonSchema.CodeGeneration.CSharp;
using NSwag;
using NSwag.CodeGeneration;
using NSwag.CodeGeneration.CSharp;
using NSwag.CodeGeneration.CSharp.Models;
using SoftPro.Tools.Console.OpenApiGenerator.TemplateModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    /// Se base sur l'implementation https://github.com/RicoSuter/NSwag/blob/master/src/NSwag.CodeGeneration/ClientGeneratorBase.cs
    public class SoftProCsharpClientGenerator : CSharpClientGenerator
    {
        private readonly OpenApiDocument _document;
        private SoftProCsharpClientGeneratorSettings _settings;

        public SoftProCsharpClientGenerator(OpenApiDocument document, SoftProCsharpClientGeneratorSettings settings) : base(document, settings)
        {
            _document = document;
            _settings = settings;
        }


        public IEnumerable<CodeArtifact> GenerateEndPoints()
        {
            return base.GenerateAllClientTypes();
        }


        protected override CSharpOperationModel CreateOperationModel(OpenApiOperation operation, ClientGeneratorBaseSettings settings)
        {
            return new SoftProCSharpOperationModel(operation, (CSharpGeneratorBaseSettings)settings, this, (CSharpTypeResolver)Resolver);
        }

        //public IEnumerable<CodeArtifact> GenerateEndPoints()
        //{
        //    return base.GenerateAllClientTypes();
        //}

        internal IEnumerable<CodeArtifact> GenerateShared()
        {
            var exceptionSchema = (Resolver as CSharpTypeResolver)?.ExceptionSchema;

            var model = new SoftProCSharpClientTemplateModel(string.Empty, "ReponseHelper", null, exceptionSchema, _document, _settings);

            // Code ResponseHelper
            var interfaceTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "ResponseHelper", model);
            yield return new CodeArtifact(model.Class, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, interfaceTemplate);

            //// Mock Helper
            //var mockHelperTemplateModel = new MockHelperTemplateModel(_settings);
            //var mockHelperTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "MockHelper", mockHelperTemplateModel);
            //yield return new CodeArtifact("MockHelper", CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, mockHelperTemplate);

            // FileResponse
            var fileResponseTemplateModel = new FileResponseTemplateModel(_settings);
            var fileResponseTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "FileResponse", fileResponseTemplateModel);
            yield return new CodeArtifact("FileResponse", CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, fileResponseTemplate);

            // SoftProRestResponse
            var SoftProRestResponseTemplateModel = new SoftProRestResponseTemplateModel(_settings);
            var SoftProRestResponseTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "SoftProRestResponse", SoftProRestResponseTemplateModel);
            yield return new CodeArtifact("SoftProRestResponse", CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, SoftProRestResponseTemplate);
        }

        protected override IEnumerable<CodeArtifact> GenerateClientTypes(string controllerName, string controllerClassName, IEnumerable<CSharpOperationModel> operations)
        {
            var exceptionSchema = (Resolver as CSharpTypeResolver)?.ExceptionSchema;

            var model = new SoftProCSharpClientTemplateModel(controllerName, controllerClassName, operations, exceptionSchema, _document, _settings);
            if (model.HasOperations)
            {
                if (model.GenerateClientInterfaces)
                {
                    var interfaceTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "IEndPoint", model);
                    yield return new CodeArtifact(model.InterfaceClassName, CodeArtifactType.Interface, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, interfaceTemplate);
                }

                var classTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "EndPoint", model);
                yield return new CodeArtifact(model.Class, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Client, classTemplate);

                //var mockTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "MockEndPoint", model);
                //yield return new CodeArtifact(model.MockClassName, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Utility, mockTemplate);
            }
        }

        public string GenerateProjectFile(ProjectInfos projectInfos)
        {
            var csprojTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "Csproj", projectInfos);
            return csprojTemplate.Render();
        }

        public string GenerateNuGetConfig(ProjectInfos projectInfos)
        {
            var csprojTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "Nuget.Config", projectInfos);
            return csprojTemplate.Render();
        }

        public string GenerateGitIgnore(ProjectInfos projectInfos)
        {
            var csprojTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "GitIgnore", projectInfos);
            return csprojTemplate.Render();
        }

        public IEnumerable<CodeArtifact> GenerateApiClass(string className, IEnumerable<CodeArtifact> endPoints)
        {
            //var endPoints = endPointList.Where(p => p.Type == CodeArtifactType.Class && !p.TypeName.StartsWith("Mock")).Select(p => p.TypeName).Distinct();
            var templateModel = new ApiClassTemplateModel(_settings, className, endPoints);            

            if (_settings.GenerateClientInterfaces)
            {
                var interfaceTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "IApi", templateModel);
                yield return new CodeArtifact(templateModel.InterfaceClassName, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Contract, interfaceTemplate);
            }

            var apiTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "Api", templateModel);
            yield return new CodeArtifact(templateModel.ClassName, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Client, apiTemplate);

            //var mockTemplate = Settings.CSharpGeneratorSettings.TemplateFactory.CreateTemplate("CSharp", "MockApi", templateModel);
            //yield return new CodeArtifact(templateModel.MockClassName, CodeArtifactType.Class, CodeArtifactLanguage.CSharp, CodeArtifactCategory.Utility, mockTemplate);
        }

        public IEnumerable<CodeArtifact> GenerateModels()
        {
            var generator = new SoftProCSharpGenerator(_document, _settings.CSharpGeneratorSettings, (Resolver as CSharpTypeResolver));
            return generator.GenerateTypes();
        }
    }
}
