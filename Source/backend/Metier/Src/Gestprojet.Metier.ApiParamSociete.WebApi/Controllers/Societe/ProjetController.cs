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
    [Route("api/projets")]
    [Route("api/projet")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAll")]
    public class ProjetController : ControllerBase
    {
        private readonly IProjetBusiness _projetBusiness;

        public ProjetController(IProjetBusiness projetBusiness)
            => _projetBusiness = projetBusiness;

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] ProjetCore entity)
            => await AjouterOuModifier(entity);

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] ProjetCore entity)
        {
            if (entity == null) return BadRequest("Données Projet invalides");
            var result = await _projetBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjetCore entity)
            => await AjouterOuModifier(entity);

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] ProjetCore entity)
            => await AjouterOuModifier(entity);

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ProjetCore entity)
            => await AjouterOuModifier(entity);

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _projetBusiness.ListeAsync());

        [HttpGet("liste")]
        public async Task<IActionResult> Liste()
            => Ok(await _projetBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _projetBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Projet introuvable") : Ok(r);
        }

        [HttpGet("obtenir/id/{id}")]
        public async Task<IActionResult> ObtenirParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _projetBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Projet introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _projetBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _projetBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeParCondition")]
        public async Task<IActionResult> ListeParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return Ok(await _projetBusiness.ListeAsync());
            return Ok(await _projetBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("liste-par-condition")]
        public async Task<IActionResult> ListeParConditionSimple([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return Ok(await _projetBusiness.ListeAsync());
            return Ok(await _projetBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _projetBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _projetBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _projetBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _projetBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("supprimer-par-condition")]
        public async Task<IActionResult> SupprimerParConditionSimple([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _projetBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _projetBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<IActionResult> ListeParPageRoute(int pageNumero, int pageTaille)
            => Ok(await _projetBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _projetBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<IActionResult> ListeParConditionParPageRoute([FromBody] ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _projetBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _projetBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpGet("ParSociete/{societeId}")]
        public async Task<IActionResult> GetProjetsParSociete(string societeId)
        {
            if (string.IsNullOrWhiteSpace(societeId)) return BadRequest("SocieteId requis");
            var result = await _projetBusiness.ListeParSocieteAsync(societeId);
            return Ok(result);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _projetBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }

        [HttpGet("{id}/burndown")]
        public IActionResult GetBurndown(string id)
        {
            // Simulation de données Burndown pour le dashboard
            var burndownData = new[]
            {
                new { day = "Lun", ideal = 100, remaining = 95 },
                new { day = "Mar", ideal = 80, remaining = 85 },
                new { day = "Mer", ideal = 60, remaining = 55 },
                new { day = "Jeu", ideal = 40, remaining = 30 },
                new { day = "Ven", ideal = 20, remaining = 15 },
                new { day = "Sam", ideal = 0, remaining = 5 }
            };
            return Ok(burndownData);
        }
    }
}
