using System;
using System.Threading.Tasks;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Services;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure.Services
{
    public class StripeService : IStripeService
    {
        // En production, on utiliserait le SDK Stripe.net
        // private readonly string _apiKey = "sk_test_...";

        public async Task<string> CreateCheckoutSessionAsync(string societeId, decimal montant, string description)
        {
            // Simulation d'une session Stripe
            await Task.Delay(500);

            // On retourne une URL de test Stripe ou une URL interne simulée
            return "https://checkout.stripe.com/pay/cs_test_" + Guid.NewGuid().ToString("N");
        }
    }
}
