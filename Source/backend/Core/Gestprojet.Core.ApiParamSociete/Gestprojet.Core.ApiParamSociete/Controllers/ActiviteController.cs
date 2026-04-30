using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActiviteController : ControllerBase
    {
        private readonly IDemandeLogCoreBusiness _logBusiness;

        public ActiviteController(IDemandeLogCoreBusiness logBusiness)
        {
            _logBusiness = logBusiness;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string societeId, [FromQuery] int limit = 10)
        {
            try
            {
                var logs = await _logBusiness.ListeDemandeLogCoreAsync();
                var societeLogs = logs
                    .Where(l => l.EntiteId == societeId)
                    .OrderByDescending(l => l.DateCreation)
                    .Take(limit)
                    .Select(l => new
                    {
                        id = l.Id,
                        action = l.Action,
                        description = l.Description,
                        type = l.EntiteType,
                        date = l.DateCreation,
                        utilisateur = l.UtilisateurId
                    });

                return Ok(societeLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ActiviteRequest request)
        {
            try
            {
                var log = new DemandeLogCore
                {
                    Id = Guid.NewGuid().ToString(),
                    UtilisateurId = request.UtilisateurId ?? "System",
                    Action = request.Action,
                    Description = request.Description,
                    EntiteType = request.Type, // e.g., 'rh', 'projet', 'system'
                    EntiteId = request.SocieteId,
                    DateCreation = DateTime.Now
                };

                var success = await _logBusiness.AjouterDemandeLogCoreAsync(log);
                return success ? Ok(new { success = true }) : BadRequest("Failed to log activity");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        public class ActiviteRequest
        {
            public string Action { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
            public string SocieteId { get; set; }
            public string UtilisateurId { get; set; }
        }
    }
}
