using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/abonnements")]
    public class AbonnementController : ControllerBase
    {
        private static readonly List<object> _abonnements = new List<object>();

        [HttpGet]
        public IActionResult GetAbonnements()
        {
            return Ok(_abonnements);
        }

        [HttpPost]
        public IActionResult CreateAbonnement([FromBody] dynamic abonnement)
        {
            _abonnements.Add(abonnement);
            return Ok(new { success = true, message = "Abonnement créé avec succès", data = abonnement });
        }
    }
}
