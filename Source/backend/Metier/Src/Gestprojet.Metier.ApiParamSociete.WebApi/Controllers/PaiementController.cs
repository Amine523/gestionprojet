using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/paiements")]
    public class PaiementController : ControllerBase
    {
        private static readonly List<object> _paiements = new List<object>();

        [HttpGet]
        public IActionResult GetPaiements()
        {
            return Ok(_paiements);
        }

        [HttpPost]
        public IActionResult CreatePaiement([FromBody] dynamic paiement)
        {
            _paiements.Add(paiement);
            return Ok(new { success = true, message = "Paiement créé avec succès", data = paiement });
        }
    }
}
