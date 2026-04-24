using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class OllamaController : ControllerBase
    {
        private readonly OllamaService _ollamaService;

        public OllamaController(OllamaService ollamaService)
        {
            _ollamaService = ollamaService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateText([FromBody] GenerateRequest request)
        {
            try
            {
                var response = await _ollamaService.GenerateTextAsync(request.Prompt, request.Model);
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class GenerateRequest
    {
        public string Prompt { get; set; } = string.Empty;
        public string Model { get; set; } = "llama2";
    }
}