using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/candidatures")]
    public class CandidatureController : ControllerBase
    {
        private readonly IApplicationBusiness _applicationBusiness;

        public CandidatureController(IApplicationBusiness applicationBusiness)
        {
            _applicationBusiness = applicationBusiness;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "Candidature" }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpGet("offre/{offreId}")]
        public async Task<IActionResult> GetByOffre(string offreId)
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "Candidature" },
                    { "Statut", offreId } // Assuming Statut is used for OffreId in Candidature context or similar mapping
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpGet("candidat/{candidatId}")]
        public async Task<IActionResult> GetByCandidat(string candidatId)
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "Candidature" },
                    { "UtilisateurId", candidatId }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationCore candidature)
        {
            if (candidature == null) return BadRequest("Données invalides");
            candidature.Type = "Candidature";
            if (string.IsNullOrEmpty(candidature.Id)) candidature.Id = "CAND_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
            var result = await _applicationBusiness.AjouterOuModifierAsync(candidature);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ApplicationCore candidature)
        {
            if (candidature == null || string.IsNullOrEmpty(candidature.Id)) return BadRequest("Données invalides");
            candidature.Type = "Candidature";
            var result = await _applicationBusiness.AjouterOuModifierAsync(candidature);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _applicationBusiness.ObtenirAsync(id);
            return result == null ? NotFound() : Ok(result);
        }
    }
}
