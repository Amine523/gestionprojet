using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;
using System;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluationController : ControllerBase
    {
        private readonly EvaluationService _service;

        public EvaluationController(EvaluationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Evaluate([FromBody] EvaluationRequestDTO request)
        {
            if (request == null || request.Data == null)
            {
                return BadRequest(new { error = "Données de requête invalides" });
            }

            try
            {
                var result = await _service.EvaluateAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "L'évaluation a échoué", message = ex.Message });
            }
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "Le service d'évaluation est opérationnel", timestamp = DateTime.UtcNow });
        }
    }
}
