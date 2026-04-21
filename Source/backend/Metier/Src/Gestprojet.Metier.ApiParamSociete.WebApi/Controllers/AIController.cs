using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly OllamaService _ollamaService;
        private readonly ILogger<AIController> _logger;

        public AIController(OllamaService ollamaService, ILogger<AIController> logger)
        {
            _ollamaService = ollamaService;
            _logger = logger;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            var isAvailable = await _ollamaService.IsAvailableAsync();
            return Ok(new { available = isAvailable });
        }

        [HttpPost("project-insights")]
        public async Task<IActionResult> GetProjectInsights([FromBody] dynamic requestData)
        {
            try
            {
                string data = requestData?.data?.ToString() ?? "";
                var insights = await _ollamaService.GenerateTextAsync($"Analyse ces données de projet et donne des insights: {data}", "llama3");
                return Ok(new { insights });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("rh-insights")]
        public async Task<IActionResult> GetRhInsights([FromBody] dynamic requestData)
        {
            try
            {
                string data = requestData?.data?.ToString() ?? "";
                var insights = await _ollamaService.GenerateTextAsync($"Analyse ces données RH et donne des insights sur la performance et le turnover: {data}", "llama3");
                return Ok(new { insights });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("dashboard-insights")]
        public async Task<IActionResult> GetDashboardInsights([FromBody] dynamic requestData)
        {
            try
            {
                string data = requestData?.data?.ToString() ?? "";
                var insights = await _ollamaService.GenerateTextAsync($"Analyse ces données de dashboard global et donne des résumés stratégiques: {data}", "llama3");
                return Ok(new { insights });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] dynamic chatRequest)
        {
            try
            {
                string message = chatRequest?.message?.ToString() ?? "";
                string context = chatRequest?.context?.ToString() ?? "";
                var response = await _ollamaService.GenerateTextAsync($"Contexte: {context}\nQuestion: {message}", "llama3");
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class ProjectRiskRequest { public string ProjectId { get; set; } = ""; }
    public class ProjectRiskResponse
    {
        public string ProjectId { get; set; } = "";
        public string RiskLevel { get; set; } = "";
        public double RiskScore { get; set; }
        public string AIRecommendations { get; set; } = "";
        public DateTime AnalyzedAt { get; set; }
    }

    public class EmployeePerformanceRequest { public string EmployeeId { get; set; } = ""; }
    public class EmployeePerformanceResponse
    {
        public string EmployeeId { get; set; } = "";
        public string PerformanceLevel { get; set; } = "";
        public double CompletionRate { get; set; }
        public string AIFeedback { get; set; } = "";
        public DateTime AnalyzedAt { get; set; }
    }

    public class CandidateRecommendationRequest
    {
        public string JobTitle { get; set; } = "";
        public string RequiredSkills { get; set; } = "";
    }
    public class CandidateRecommendationResponse
    {
        public string JobTitle { get; set; } = "";
        public string Recommendations { get; set; } = "";
        public DateTime GeneratedAt { get; set; }
    }

    public class GenerateTestRequest
    {
        public string Topic { get; set; } = "";
        public int QuestionCount { get; set; } = 5;
        public string QuestionType { get; set; } = "QCM";
    }
    public class TestGenerationResponse
    {
        public string Topic { get; set; } = "";
        public string GeneratedQuestions { get; set; } = "";
        public DateTime GeneratedAt { get; set; }
    }

    public class AIChatRequest { public string Message { get; set; } = ""; }
    public class AIChatResponse
    {
        public string Message { get; set; } = "";
        public string Response { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }

    public class DashboardInsightsResponse
    {
        public string SocieteId { get; set; } = "";
        public string Summary { get; set; } = "";
        public DateTime GeneratedAt { get; set; }
    }
}