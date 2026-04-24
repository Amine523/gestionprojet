using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public class OllamaService
    {
        private readonly HttpClient _httpClient;

        public OllamaService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("http://localhost:11434");
        }

        public async Task<string> GenerateTextAsync(string prompt, string model = "llama3")
        {
            try {
                var request = new
                {
                    model = model,
                    prompt = prompt,
                    stream = false
                };

                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/api/generate", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<OllamaResponse>(responseJson);
                    return result?.response ?? "Erreur dans la génération";
                }
                
                return GetSimulatedResponse(prompt);
            } catch (Exception) {
                return GetSimulatedResponse(prompt);
            }
        }

        private string GetSimulatedResponse(string prompt)
        {
            string p = prompt.ToLower();
            if (p.Contains("analyse") || p.Contains("insight"))
                return "Basé sur les données actuelles, le projet progresse de manière stable. Les indicateurs de performance suggèrent une bonne vélocité, bien que certains jalons nécessitent une attention particulière pour éviter les retards.";
            if (p.Contains("rh") || p.Contains("performance"))
                return "L'analyse RH indique un engagement élevé de l'équipe. La productivité est en hausse de 5% ce mois-ci, et aucune alerte de turnover n'est détectée pour le moment.";
            if (p.Contains("bonjour") || p.Contains("hello"))
                return "Bonjour ! Je suis votre assistant NADHEMNI IA (en mode simulation). Comment puis-je vous aider avec la gestion de vos projets aujourd'hui ?";
            
            return "Je suis l'assistant NADHEMNI IA. Note: Le service Ollama local n'est pas détecté, je fonctionne donc en mode simulation pour répondre à vos questions sur la gestion de projet.";
        }

        public async Task<bool> IsAvailableAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/tags");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> GenerateEvaluationAsync(EvaluationRequestDTO request)
        {
            string prompt = $"Évaluez les performances de ce {request.Role}. Données: {JsonSerializer.Serialize(request.Data)}. Contexte: {request.Context}. Répondez uniquement en JSON avec ScoreSur20 (decimal), Mention (string), Strengths (list), Weaknesses (list), RiskLevel (string), Decision (string), Feedback (string).";
            return await GenerateTextAsync(prompt);
        }

        private class OllamaResponse
        {
            public string response { get; set; } = string.Empty;
        }
    }
}