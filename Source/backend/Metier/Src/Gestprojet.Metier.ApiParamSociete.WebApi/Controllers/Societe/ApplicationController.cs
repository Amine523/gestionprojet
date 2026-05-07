using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
[ApiController]
[Route("api/application")]
[AllowAnonymous]
public class ApplicationController : ControllerBase
    {
        private readonly IApplicationBusiness _applicationBusiness;

        public ApplicationController(IApplicationBusiness applicationBusiness)
            => _applicationBusiness = applicationBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] ApplicationCore entity)
        {
            if (entity == null) return BadRequest("Données Application invalides");
            var result = await _applicationBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] ApplicationCore entity)
        {
            try
            {
                if (entity == null) return BadRequest("Données Application invalides");
                entity.Id = string.Empty;
                var result = await _applicationBusiness.AjouterOuModifierAsync(entity);
                return result.Success ? Ok(result.Message) : BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erreur lors de l'enregistrement de la candidature", detail = ex.Message });
            }
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] ApplicationCore entity)
        {
            try
            {
                if (entity == null) return BadRequest("Données Application invalides");
                var result = await _applicationBusiness.AjouterOuModifierAsync(entity);
                return result.Success ? Ok(result.Message) : BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erreur lors de la mise à jour de la candidature", detail = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _applicationBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _applicationBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Application introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _applicationBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _applicationBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("liste-par-condition")]
        public async Task<IActionResult> ListeParConditionAction([FromBody] ConditionRecherche request)
        {
            if (request == null) return BadRequest("Critère manquant");
            try
            {
                return Ok(await _applicationBusiness.ListeParCritereAsync(request));
            }
            catch (Exception)
            {
                return Ok(new List<ApplicationCore>());
            }
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _applicationBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _applicationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _applicationBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _applicationBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _applicationBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _applicationBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _applicationBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }
    }
}
