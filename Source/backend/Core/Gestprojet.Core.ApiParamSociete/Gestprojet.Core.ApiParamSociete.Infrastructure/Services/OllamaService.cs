using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure.Services
{
    public interface IOllamaService
    {
        Task<string> GenerateAsync(string prompt, string model = "llama3.2");
        Task<string> AnalyzeCandidateAsync(string candidateData, string jobRequirements);
        Task<string> PredictProjectDelayAsync(string projectData);
        Task<string> AnalyzeDeveloperPerformanceAsync(string developerData);
    }

    public class OllamaService : IOllamaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _ollamaUrl;
        private readonly string _defaultModel;

        public OllamaService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _ollamaUrl = configuration["Ollama:Url"] ?? "http://localhost:11434";
            _defaultModel = configuration["Ollama:Model"] ?? "llama3.2";
        }

        public async Task<string> GenerateAsync(string prompt, string model = "llama3.2")
        {
            try
            {
                var request = new
                {
                    model = model,
                    prompt = prompt,
                    stream = false
                };

                var response = await _httpClient.PostAsJsonAsync($"{_ollamaUrl}/api/generate", request);
                
                if (!response.IsSuccessStatusCode)
                {
                    return $"Erreur Ollama: {response.StatusCode}";
                }

                var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                return result?.Response ?? "Aucune réponse";
            }
            catch (Exception ex)
            {
                return $"Erreur de connexion Ollama: {ex.Message}";
            }
        }

        public async Task<string> AnalyzeCandidateAsync(string candidateData, string jobRequirements)
        {
            var prompt = $@"Tu es un expert RH et recrutement. Analyse ce candidat pour le poste décrit.

 Poste:
 {jobRequirements}

 Données du candidat:
 {candidateData}

 Fournis:
 1. Score de compatibilité (0-100%)
 2. Forces du candidat
 3. Points faibles
 4. Recommandation (Embaucher/Non Embaucher/Entretien)"
            ;

            return await GenerateAsync(prompt);
        }

        public async Task<string> PredictProjectDelayAsync(string projectData)
        {
            var prompt = $@"Tu es un expert en gestion de projets. Analyse les risques de retard pour ce projet.

 Données du projet:
 {projectData}

 Fournis:
 1. Probabilité de retard (%)
 2. Facteurs de risque identifiés
 3. Recommandations pour éviter les retards
 4. Actions préventives suggested";

            return await GenerateAsync(prompt);
        }

        public async Task<string> AnalyzeDeveloperPerformanceAsync(string developerData)
        {
            var prompt = $@"Tu es un expert en évaluation de performance. Analyse ce développeur.

 Données:
 {developerData}

 Fournis:
 1. Score de performance global (0-100%)
 2. Compétences techniques (évaluation 1-5)
 3. Points forts
 4. Axes d'amélioration
 5. Recommandations de formation";

            return await GenerateAsync(prompt);
        }

        private class OllamaResponse
        {
            public string? Response { get; set; }
        }
    }
}

namespace Microsoft.Extensions.DependencyInjection
{
    public static class OllamaServiceExtensions
    {
        public static IServiceCollection AddOllama(this IServiceCollection services)
        {
            services.AddScoped<Gestprojet.Core.ApiParamSociete.Infrastructure.Services.IOllamaService, 
                              Gestprojet.Core.ApiParamSociete.Infrastructure.Services.OllamaService>();
            return services;
        }
    }
}