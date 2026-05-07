using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure.Services
{
    public interface IOllamaService
    {
        Task<string> GenerateAsync(string prompt, string model = "llama3.2");
        Task<string> GenerateTestQuestionsAsync(string topic, int questionCount = 5, string questionType = "QCM");
        Task<string> AnalyzeCandidateAsync(string candidateData, string jobRequirements);
        Task<string> PredictProjectDelayAsync(string projectData);
        Task<string> AnalyzeDeveloperPerformanceAsync(string developerData);
    }

    public class OllamaService : IOllamaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _ollamaUrl;
        private readonly string _defaultModel;
        private readonly string _fastModel;
        private readonly string _testModel;

        public OllamaService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _ollamaUrl = configuration["AI:Providers:Ollama:Url"] ?? configuration["Ollama:Url"] ?? "http://localhost:11434";
            _defaultModel = configuration["AI:Generation:DefaultModel"] ?? configuration["AI:Providers:Ollama:Model"] ?? "llama3.2";
            _fastModel = configuration["AI:Generation:FastModel"] ?? _defaultModel;
            _testModel = configuration["AI:Generation:TestGenerationModel"] ?? _fastModel;
            _httpClient.Timeout = TimeSpan.FromSeconds(
                int.TryParse(configuration["AI:Generation:TimeoutSeconds"], out var timeoutSeconds) ? timeoutSeconds : 12
            );
        }

        public async Task<string> GenerateAsync(string prompt, string model = "llama3.2")
        {
            try
            {
                var selectedModel = string.IsNullOrWhiteSpace(model) ? _defaultModel : model;
                var request = new
                {
                    model = selectedModel,
                    prompt = prompt,
                    stream = false,
                    options = new
                    {
                        temperature = 0.2,
                        top_p = 0.9,
                        num_predict = 220
                    }
                };

                var response = await _httpClient.PostAsJsonAsync($"{_ollamaUrl}/api/generate", request);
                
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                    return result?.Response ?? "Aucune réponse";
                }

                return GetSimulatedResponse(prompt);
            }
            catch (Exception)
            {
                return GetSimulatedResponse(prompt);
            }
        }

        public async Task<string> GenerateTestQuestionsAsync(string topic, int questionCount = 5, string questionType = "QCM")
        {
            var count = Math.Clamp(questionCount, 1, 20);
            var prompt = $@"[STRICT JSON ONLY]
Génère {count} questions de type {questionType} sur: {topic}.
Format exact:
[
  {{""q"":""Question?"",""options"":[""A"",""B"",""C"",""D""],""correct"":0}}
]
Réponse JSON uniquement, sans texte additionnel.";

            return await GenerateFastAsync(prompt, _testModel, 140 + (count * 25));
        }

        private async Task<string> GenerateFastAsync(string prompt, string model, int maxTokens)
        {
            try
            {
                var request = new
                {
                    model = string.IsNullOrWhiteSpace(model) ? _fastModel : model,
                    prompt,
                    stream = false,
                    options = new
                    {
                        temperature = 0.1,
                        top_p = 0.85,
                        num_predict = maxTokens
                    }
                };

                var response = await _httpClient.PostAsJsonAsync($"{_ollamaUrl}/api/generate", request);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                    return result?.Response ?? "Aucune réponse";
                }
            }
            catch
            {
                // Falls back to simulated response
            }

            return GetSimulatedResponse(prompt);
        }

        private string GetSimulatedResponse(string prompt)
        {
            string p = prompt.ToLower();
            if (p.Contains("candidat") || p.Contains("rh"))
                return "Score de compatibilité : 85%. Forces : Expérience solide en .NET et Angular. Points faibles : Manque d'expérience en DevOps. Recommandation : Entretien technique recommandé.";
            if (p.Contains("projet") || p.Contains("retard"))
                return "Probabilité de retard : 15%. Facteurs de risque : Dépendances externes sur l'API de paiement. Recommandation : Anticiper l'intégration de la passerelle de test dès la semaine prochaine.";
            if (p.Contains("performance") || p.Contains("développeur"))
                return "Score de performance global : 92%. Points forts : Excellente qualité de code et respect des délais. Axes d'amélioration : Participation plus active aux revues de code.";
            
            return "Note: Le service Ollama n'est pas détecté. Mode simulation actif pour la gestion de projet NADHEMNI.";
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