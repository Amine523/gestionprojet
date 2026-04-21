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
    }
}