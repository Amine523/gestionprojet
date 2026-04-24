using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/OffreEmploI")]
    [Route("api/offresemploi")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class OffreEmploiController : ControllerBase
    {
        private readonly IApplicationBusiness _applicationBusiness;

        public OffreEmploiController(IApplicationBusiness applicationBusiness)
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
                    { "Type", "OffreEmploi" }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpGet("liste")]
        public async Task<IActionResult> Liste()
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "OffreEmploi" }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpGet("actives")]
        public async Task<IActionResult> GetActives()
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "OffreEmploi" },
                    { "Statut", "OUVERTE" }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySociete(string societeId)
        {
            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string>
                {
                    { "Type", "OffreEmploi" },
                    { "SocieteId", societeId }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationCore offre)
        {
            if (offre == null) return BadRequest("Données invalides");
            offre.Type = "OffreEmploi";
            if (string.IsNullOrEmpty(offre.Id))
                offre.Id = "OFFRE_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
            
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] ApplicationCore offre)
        {
            if (offre == null) return BadRequest("Données invalides");
            if (string.IsNullOrWhiteSpace(offre.Titre)) return BadRequest("Titre requis");
            if (string.IsNullOrWhiteSpace(offre.SocieteId)) return BadRequest("SocieteId requis");
            offre.Type = "OffreEmploi";
            offre.Id = string.Empty;
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ApplicationCore offre)
        {
            if (offre == null || string.IsNullOrEmpty(offre.Id)) return BadRequest("Données invalides");
            offre.Type = "OffreEmploi";
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] ApplicationCore offre)
        {
            if (offre == null || string.IsNullOrEmpty(offre.Id)) return BadRequest("Données invalides");
            offre.Type = "OffreEmploi";
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
