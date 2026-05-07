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
    [Route("api/types")]
    [AllowAnonymous]
    public class TypeController : ControllerBase
    {
        private readonly ITypeBusiness _typeBusiness;

        public TypeController(ITypeBusiness typeBusiness)
            => _typeBusiness = typeBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] TypeCore entity)
        {
            if (entity == null) return BadRequest("Données Type invalides");
            var result = await _typeBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _typeBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _typeBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Type introuvable") : Ok(r);
        }

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _typeBusiness.ListeParCritereAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _typeBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _typeBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _typeBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _typeBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }
    }
}
