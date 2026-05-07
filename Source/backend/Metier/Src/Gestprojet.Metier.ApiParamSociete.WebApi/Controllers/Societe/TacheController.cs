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
    [Route("api/taches")]
    [AllowAnonymous]
    public class TacheController : ControllerBase
    {
        private readonly ITacheBusiness _tacheBusiness;

        public TacheController(ITacheBusiness tacheBusiness)
            => _tacheBusiness = tacheBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] TacheCore entity)
        {
            if (entity == null) return BadRequest("Données Tache invalides");
            var result = await _tacheBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] TacheCore entity)
        {
            if (entity == null) return BadRequest("Données Tache invalides");
            entity.Id = string.Empty;
            var result = await _tacheBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] TacheCore entity)
        {
            if (entity == null) return BadRequest("Données Tache invalides");
            var result = await _tacheBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TacheCore entity)
            => await AjouterOuModifier(entity);

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] TacheCore entity)
        {
            if (entity != null) entity.Id = id;
            return await AjouterOuModifier(entity!);
        }

        [HttpGet]
        [HttpGet("liste")]
        public async Task<IActionResult> GetAll()
            => Ok(await _tacheBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _tacheBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Tache introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _tacheBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        [HttpPost("liste-par-condition")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _tacheBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _tacheBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _tacheBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _tacheBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromRoute] int pageNumero = 1, [FromRoute] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _tacheBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _tacheBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }
    }
}
