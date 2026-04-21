using NSwag;
using NUnit.Framework;
using SoftPro.Tools.Console.OpenApiGenerator.CSharp;
using System.IO;
using System.Threading.Tasks;

namespace SoftPro.Tools.OpenApiGenerator.Tests
{
    public class SoftProCSharpOperationModelTests
    {
        [Test]
        [TestCase("BoaDocTableaux")]
        [TestCase("DevisSoucriptionIndiv")]
        [TestCase("DocumentsQualifies")]
        [TestCase("Entreprise")]
        [TestCase("MiseEnRelation")]
        [TestCase("SoftPro.SecuriteSociale.WebApi")]
        [TestCase("OffreEvin")]
        [TestCase("QualifDocGestion")]
        [TestCase("ReferanceJobs")]
        [TestCase("TableauxGaranties")]
        [TestCase("TarificateurWebApi")]
        [TestCase("WaCoreArchivage")]
        [TestCase("WaCoreClient")]
        [TestCase("WaCoreLRE")]
        [TestCase("WaCoreMail")]
        [TestCase("WaCoreSignatureElectronique")]
        [TestCase("WaCoreSocietaire")]
        ////[TestCase("OffreRevolution")]
        ////[TestCase("QualificationDocumentaire")]
        ////[TestCase("SecUtilisateur")]
        public async Task GenerateEndPointsTest(string jsonFileName)
        {
            string currentDirectory = Directory.GetCurrentDirectory();
            string webapiFilePath = Path.Combine(currentDirectory, "exemples", $"{jsonFileName}.json");

            var projetInfo = new ProjectInfos()
            {
                OpenApiDocument = await OpenApiDocument.FromFileAsync(webapiFilePath)
            };
            var generator = new SoftProCsharpClientGenerator(projetInfo.OpenApiDocument, new SoftProCsharpClientGeneratorSettings(projetInfo.Name));

            var actual = generator.GenerateEndPoints();
            
            Assert.NotNull(actual);
        }
    }
}