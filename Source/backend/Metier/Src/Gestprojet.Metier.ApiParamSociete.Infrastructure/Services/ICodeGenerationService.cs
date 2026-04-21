namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Services
{
    public interface ICodeGenerationService
    {
        /// <summary>Generates a prefixed code, e.g. CAT-001</summary>
        string GenerateCode(string prefix, int sequence, int maxLength = 10, int digits = 3);
        /// <summary>Generates a numeric-only code without prefix, e.g. 001</summary>
        string GenerateNumericCode(int sequence, int digits = 3);
    }
}
