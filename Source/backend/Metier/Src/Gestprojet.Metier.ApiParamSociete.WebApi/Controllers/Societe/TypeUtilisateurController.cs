using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/typeutilisateurs")]
    [Route("api/auth/roles")]
    [AllowAnonymous]
    public class TypeUtilisateurController : ControllerBase
    {
        private readonly ITypeUtilisateurBusiness _typeUtilisateurBusiness;

        public TypeUtilisateurController(ITypeUtilisateurBusiness typeUtilisateurBusiness)
            => _typeUtilisateurBusiness = typeUtilisateurBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] TypeUtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données TypeUtilisateur invalides");
            var result = await _typeUtilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] TypeUtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données TypeUtilisateur invalides");
            entity.Id = string.Empty;
            var result = await _typeUtilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] TypeUtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données TypeUtilisateur invalides");
            var result = await _typeUtilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _typeUtilisateurBusiness.ListeAsync());

        [HttpGet("liste")]
        public async Task<IActionResult> Liste()
            => Ok(await _typeUtilisateurBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _typeUtilisateurBusiness.ObtenirAsync(id);
            return r == null ? NotFound("TypeUtilisateur introuvable") : Ok(r);
        }

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _typeUtilisateurBusiness.ListeParCritereAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _typeUtilisateurBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _typeUtilisateurBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _typeUtilisateurBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _typeUtilisateurBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _typeUtilisateurBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }
    }
}