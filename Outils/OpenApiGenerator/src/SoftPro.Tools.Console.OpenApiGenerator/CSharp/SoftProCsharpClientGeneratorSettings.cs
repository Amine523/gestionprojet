using NJsonSchema.CodeGeneration.CSharp;
using NSwag.CodeGeneration.CSharp;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    public class SoftProCsharpClientGeneratorSettings : CSharpClientGeneratorSettings
    {
        public SoftProCsharpClientGeneratorSettings(string nameSpace) : base()
        {
            
            OperationNameGenerator = new SoftProOperationNameGenerator();

            CSharpGeneratorSettings.Namespace = nameSpace;

            CSharpGeneratorSettings.DateType = "System.DateTime";
            CSharpGeneratorSettings.DateTimeType = "System.DateTime";
            CSharpGeneratorSettings.ArrayType = "System.Collections.Generic.List";
            CSharpGeneratorSettings.ArrayInstanceType = "System.Collections.Generic.List";

            CodeGeneratorSettings.TemplateFactory = new SoftProCSharpTemplateFactory(CSharpGeneratorSettings, new[]
            {
                typeof(CSharpGeneratorSettings).GetTypeInfo().Assembly,
                typeof(CSharpGeneratorBaseSettings).GetTypeInfo().Assembly,
                typeof(SoftProCsharpClientGeneratorSettings).GetTypeInfo().Assembly
            });
            
         
            GenerateClientInterfaces = true;
            GeneratePrepareRequestAndProcessResponseAsAsyncMethods = true;
           
           
            
            //GenerateClientClasses = false;
        }
    }
}
