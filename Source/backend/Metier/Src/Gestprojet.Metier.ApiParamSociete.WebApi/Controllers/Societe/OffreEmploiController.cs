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
    [Route("api/offresemploi")]
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
                    { "Type", "OffreEmploI" }
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
                    { "Type", "OffreEmploI" },
                    { "Statut", "Active" }
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
                    { "Type", "OffreEmploI" },
                    { "SocieteId", societeId }
                }
            };
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationCore offre)
        {
            if (offre == null) return BadRequest("Données invalides");
            offre.Type = "OffreEmploI";
            if (string.IsNullOrEmpty(offre.Id)) offre.Id = "OFFRE_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ApplicationCore offre)
        {
            if (offre == null || string.IsNullOrEmpty(offre.Id)) return BadRequest("Données invalides");
            offre.Type = "OffreEmploI";
            var result = await _applicationBusiness.AjouterOuModifierAsync(offre);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
