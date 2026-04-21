using NJsonSchema;
using NSwag;
using NSwag.CodeGeneration.OperationNameGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoftPro.Tools.Console.OpenApiGenerator.CSharp
{
    /// <summary>
    /// Créer le nom du client et de l'opération en se base sur le chemin api 
    /// Ex : GET /tableaux/{id} => Client TableauxClient 
    ///                     => Operation : Get 
    /// Ex : GET /tableaux/{id}/Bloc => Client TableauxClient 
    ///                     => Operation : GetBloc 
    /// </summary>
    public class SoftProOperationNameGenerator : IOperationNameGenerator
    {
        public bool SupportsMultipleClients => true;

        public string GetClientName(OpenApiDocument document, string path, string httpMethod, OpenApiOperation operation)
        {
            IEnumerable<string> paths = path.Split('/');
            if (!paths.Any()) return "Index";

            return $"{paths.First()}";
        }


        /// <summary>
        /// Génération du nom de la méthode client 
        /// L'opération id est traité en priorité 
        /// Si l'operation id n'est pas renseigné, construction a partir du verbe HTTP + chemin
        /// </summary>
        /// <param name="document"></param>
        /// <param name="path"></param>
        /// <param name="httpMethod"></param>
        /// <param name="operation"></param>
        /// <returns></returns>
        public string GetOperationName(OpenApiDocument document, string path, string httpMethod, OpenApiOperation operation)
        {
            string operationName = string.Empty;

            if (operation != null && !string.IsNullOrEmpty(operation.OperationId)) operationName = GetOperationNameByOperationId(path, operation.OperationId);
            else operationName = ConvertPathToName(httpMethod, path);
        

            //var hasNameConflict = document.Paths
            //    .SelectMany(pair => pair.Value.Select(p => new { Path = pair.Key.Trim('/'), HttpMethod = p.Key, Operation = p.Value }))
            //    .Where(op =>
            //        GetClientName(document, op.Path, op.HttpMethod, op.Operation) == GetClientName(document, path, httpMethod, operation) &&
            //        ConvertPathToName(op.Path) == operationName
            //    ).ToList()
            //    .Count > 1;

            //if (hasNameConflict)
            //{
            //    operationName += ConversionUtilities.ConvertToUpperCamelCase(httpMethod, false);
            //}

            return ConversionUtilities.ConvertToCamelCase(operationName);
        }

        private string GetOperationNameByOperationId(string path, string operationId)
        {
            string routePrefix = string.Empty;
            string[] paths = path.Split('/');
            if (paths.Length > 0) routePrefix = paths[0];

            string result = operationId;

            if (!string.IsNullOrEmpty(routePrefix) && operationId.StartsWith($"{routePrefix}_")) result = operationId.Replace($"{routePrefix}_", string.Empty);

            result = RemoveEndDigit(result);

            if (result.EndsWith("Async")) return result.Substring(0, result.Length - 5);

            return result;
        }

        private string RemoveEndDigit(string value)
        {
            string originalValue = value;
            string result = string.Empty;

            // Si le nom fini par 'All' et qu'il est précédé d'un chiffre Ex : GetTableauxAsync2All => On enleve le All
            if (value.Length > 4 && value.EndsWith("All") && char.IsDigit(value[value.Length - 4])) originalValue = value.Substring(0, value.Length -3) ;
            
            bool firstLetter = false;
            foreach(char c in originalValue.Reverse())
            {
                if(!Char.IsDigit(c) || firstLetter)
                {

                    result += c;
                    firstLetter = true;
                }

            }

            return string.Concat(result.Reverse());
        }

        /// <summary>Converts the path to an operation name.</summary>
        /// <param name="path">The HTTP path.</param>
        /// <returns>The operation name.</returns>
        internal static string ConvertPathToName(string httpMethod, string path)
        {
            IEnumerable<string> paths = path.Split('/').Where(p => !p.Contains("{") && !string.IsNullOrWhiteSpace(p));
            if (!paths.Any() || path.Count() == 1) return httpMethod;

            string operationName = httpMethod;

            foreach(string value in paths.Skip(1))
            {
                string formattedValue = ConversionUtilities.ConvertToUpperCamelCase(value.ToLower(), true);
                operationName += formattedValue;
            }

            return  operationName;
        }
    }
}
