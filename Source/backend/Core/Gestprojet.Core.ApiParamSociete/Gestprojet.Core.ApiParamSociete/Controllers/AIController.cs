using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Services;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IOllamaService _ollamaService;

        public AIController(IOllamaService ollamaService)
        {
            _ollamaService = ollamaService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] AIGenerateRequest request)
        {
            var result = await _ollamaService.GenerateAsync(request.Prompt, request.Model);
            return Ok(new { response = result });
        }

        [HttpPost("analyze-candidate")]
        public async Task<IActionResult> AnalyzeCandidate([FromBody] AICandidateRequest request)
        {
            var result = await _ollamaService.AnalyzeCandidateAsync(request.CandidateData, request.JobRequirements);
            return Ok(new { analysis = result });
        }

        [HttpPost("predict-project-delay")]
        public async Task<IActionResult> PredictProjectDelay([FromBody] AIProjectRequest request)
        {
            var result = await _ollamaService.PredictProjectDelayAsync(request.ProjectData);
            return Ok(new { prediction = result });
        }

        [HttpPost("analyze-developer")]
        public async Task<IActionResult> AnalyzeDeveloper([FromBody] AIDeveloperRequest request)
        {
            var result = await _ollamaService.AnalyzeDeveloperPerformanceAsync(request.DeveloperData);
            return Ok(new { analysis = result });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "AI Service Ready", ollama = "Connecté à http://localhost:11434" });
        }
    }

    public class AIGenerateRequest
    {
        public string Prompt { get; set; } = "";
        public string Model { get; set; } = "llama3.2";
    }

    public class AICandidateRequest
    {
        public string CandidateData { get; set; } = "";
        public string JobRequirements { get; set; } = "";
    }

    public class AIProjectRequest
    {
        public string ProjectData { get; set; } = "";
    }

    public class AIDeveloperRequest
    {
        public string DeveloperData { get; set; } = "";
    }
}
