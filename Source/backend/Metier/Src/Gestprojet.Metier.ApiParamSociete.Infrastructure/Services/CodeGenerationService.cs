namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Services
{
    public class CodeGenerationService : ICodeGenerationService
    {
        public string GenerateCode(string prefix, int sequence, int maxLength = 10, int digits = 3)
        {
            var seq = (sequence + 1).ToString().PadLeft(digits, '0');
            var code = prefix + seq;
            return code.Length > maxLength ? code.Substring(0, maxLength) : code;
        }

        public string GenerateNumericCode(int sequence, int digits = 3)
        {
            return (sequence + 1).ToString().PadLeft(digits, '0');
        }
    }
}
