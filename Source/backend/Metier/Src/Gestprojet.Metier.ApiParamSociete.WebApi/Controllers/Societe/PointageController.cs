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
    [Route("api/pointages")]
    [Route("api/pointage")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class PointageController : ControllerBase
    {
        private readonly IPointageBusiness _pointageBusiness;

        public PointageController(IPointageBusiness pointageBusiness)
            => _pointageBusiness = pointageBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] PointageCore entity)
        {
            if (entity == null) return BadRequest("Données Pointage invalides");
            var result = await _pointageBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] PointageCore entity)
        {
            if (entity == null) return BadRequest("Données Pointage invalides");
            if (string.IsNullOrWhiteSpace(entity.UtilisateurId)) return BadRequest("UtilisateurId requis");
            if (string.IsNullOrWhiteSpace(entity.TypeId)) return BadRequest("TypeId requis");
            if (!entity.Date.HasValue) return BadRequest("Date requis");
            entity.Id = string.Empty;
            var result = await _pointageBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] PointageCore entity)
        {
            if (entity == null) return BadRequest("Données Pointage invalides");
            var result = await _pointageBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PointageCore entity)
        {
            if (entity == null) return BadRequest("Données Pointage invalides");
            var result = await _pointageBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] PointageCore entity)
        {
            if (entity == null) return BadRequest("Données Pointage invalides");
            var result = await _pointageBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _pointageBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _pointageBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Pointage introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _pointageBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _pointageBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("liste-par-condition")]
        public async Task<IActionResult> ListeParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _pointageBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _pointageBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _pointageBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _pointageBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _pointageBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<IActionResult> ListeParPageRoute(int pageNumero, int pageTaille)
            => Ok(await _pointageBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _pointageBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _pointageBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPointagesParUtilisateur(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId)) return BadRequest("UserId requis");
            var critere = new ConditionRecherche
            {
                Criteres = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "UtilisateurId", userId }
                }
            };
            return Ok(await _pointageBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _pointageBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }

        [HttpGet("rapport")]
        public IActionResult GetRapportUrl([FromQuery] string societeId, [FromQuery] int mois, [FromQuery] int annee, [FromQuery] string format = "pdf")
        {
            // Return URL for the rapport endpoint in EnhancedRHController
            return Ok(new { url = $"/api/rh/enhanced/societe/{societeId}/rapport-presence?mois={mois}&annee={annee}&format={format}" });
        }

        [HttpGet("rapport-file")]
        public IActionResult GetRapportFile([FromQuery] string societeId, [FromQuery] int mois, [FromQuery] int annee)
        {
            // This endpoint should redirect to EnhancedRHController or implement the logic
            // For now, return 501 Not Implemented
            return StatusCode(501, new { error = "Utilisez l'endpoint /api/rh/enhanced/societe/{societeId}/rapport-presence?format=csv" });
        }
    }
}