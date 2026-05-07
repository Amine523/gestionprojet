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
    [Route("api/tacheassignees")]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAll")]
    [AllowAnonymous]
    public class TacheAssignationController : ControllerBase
    {
        private readonly ITacheAssignationBusiness _tacheAssignationBusiness;
        private readonly Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService _notificationService;

        public TacheAssignationController(ITacheAssignationBusiness tacheAssignationBusiness, Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService notificationService)
        {
            _tacheAssignationBusiness = tacheAssignationBusiness;
            _notificationService = notificationService;
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] TacheAssignationCore entity)
        {
            if (entity == null) return BadRequest("Données TacheAssignation invalides");
            var result = await _tacheAssignationBusiness.AjouterOuModifierAsync(entity);
            
            if (result.Success && string.IsNullOrEmpty(entity.Id)) // It's a new assignment
            {
                await _notificationService.SendToUserAsync(
                    entity.UtilisateurId, 
                    "Nouvelle tâche", 
                    $"Une nouvelle tâche vous a été assignée.", 
                    "assignment");
            }
            
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _tacheAssignationBusiness.ObtenirAsync(id);
            return r == null ? NotFound("TacheAssignation introuvable") : Ok(r);
        }

        [HttpGet("Liste")]
        public async Task<IActionResult> Liste()
            => Ok(await _tacheAssignationBusiness.ListeAsync());

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _tacheAssignationBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheAssignationBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheAssignationBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _tacheAssignationBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _tacheAssignationBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _tacheAssignationBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _tacheAssignationBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _tacheAssignationBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _tacheAssignationBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }

    }
}
