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
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<OllamaResponse>(responseJson);

                return result?.response ?? "Erreur dans la génération";
            } catch (Exception) {
                return "Erreur dans la génération (Ollama non disponible)";
            }
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