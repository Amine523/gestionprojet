using System.Threading.Tasks;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Services
{
    public interface IStripeService
    {
        Task<string> CreateCheckoutSessionAsync(string societeId, decimal montant, string description);
    }
}
