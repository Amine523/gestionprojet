using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("expiring-subscriptions")]
        public IActionResult GetExpiringSubscriptions([FromQuery] int days = 7)
        {
            return Ok(new List<object>());
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            var stats = new Dictionary<string, int>
            {
                { "totalSocietes", 0 },
                { "totalUtilisateurs", 0 },
                { "totalAbonnements", 0 }
            };
            return Ok(stats);
        }

        [HttpGet("societes-recentes")]
        public IActionResult GetSocietesRecentes([FromQuery] int limit = 5)
        {
            return Ok(new List<object>());
        }

        [HttpGet("utilisateurs-par-type")]
        public IActionResult GetUtilisateursParType()
        {
            return Ok(new List<object>());
        }

        [HttpGet("revenus")]
        public IActionResult GetRevenus([FromQuery] string filter = "month")
        {
            var revenus = new Dictionary<string, object> { { "total", 0 } };
            return Ok(revenus);
        }

        [HttpGet("alertes")]
        public IActionResult GetAlertes()
        {
            return Ok(new List<object>());
        }

        [HttpPost("send-renewal-notification")]
        public IActionResult SendRenewalNotification()
        {
            return Ok(new { success = true });
        }

        [HttpGet("activite-recente")]
        public IActionResult GetActiviteRecente([FromQuery] int limit = 10)
        {
            return Ok(new List<object>());
        }

        [HttpGet("societes-par-mois")]
        public IActionResult GetSocietesParMois([FromQuery] int? year = null)
        {
            return Ok(new List<object>());
        }

        [HttpGet("rh-stats/{societeId}")]
        public IActionResult GetRhStats(string societeId, [FromQuery] string date = null)
        {
            var stats = new
            {
                totalEmployes = 15,
                employesActifs = 12,
                employesAbsents = 3,
                tauxPresence = 80,
                congesValidesCeMois = 2,
                demandesCongesEnAttente = 0 // The frontend re-calculates this from actual pending leaves
            };
            return Ok(stats);
        }
        [HttpGet("debug-sp")]
        public IActionResult DebugSp([FromServices] Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper.DapperContext ctx)
        {
            using (var connection = ctx.CreateConnection())
            {
                var result = Dapper.SqlMapper.Query(connection, "SELECT p.name AS ParameterName, t.name AS DataType FROM sys.parameters p INNER JOIN sys.types t ON p.user_type_id = t.user_type_id WHERE object_id = OBJECT_ID('ps_ApiParamSociete_DemandeConge_i')");
                return Ok(result);
            }
        }
    }
}