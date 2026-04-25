using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/DemandesConge")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class DemandeCongeController : ControllerBase
    {
        private readonly IDemandeCongeBusiness _business;
        private readonly Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService _notificationService;
        private readonly ILogger<DemandeCongeController> _logger;

        public DemandeCongeController(IDemandeCongeBusiness business, Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService notificationService, ILogger<DemandeCongeController> logger)
        {
            _business = business;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _business.ListeAsync());
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySociete(string societeId)
        {
            if (string.IsNullOrWhiteSpace(societeId)) return BadRequest("SocieteId requis");
            var all = await _business.ListeAsync();
            var filtered = all.Where(x => x.SocieteId == societeId).ToList();
            return Ok(filtered);
        }

        [HttpGet("solde/{userId}")]
        public IActionResult GetSolde(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId)) return BadRequest("UserId requis");
            // Return mock solde data
            return Ok(new { solde = 22, used = 5, remaining = 17 });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DemandeCongeCore entity)
        {
            if (entity == null) return BadRequest("Données invalides");
            
            // Log the received entity for debugging
            _logger.LogInformation($"Create DemandeConge: UtilisateurId={entity.UtilisateurId}, SocieteId={entity.SocieteId}, DateDebut={entity.DateDebut}, DateFin={entity.DateFin}");
            
            var result = await _business.AjouterOuModifierAsync(entity);
            
            if (result.Success)
            {
                // Notify RH of the societe (fire and forget, don't fail if notification fails)
                try
                {
                    await _notificationService.SendToSocieteAsync(
                        entity.SocieteId, 
                        "Nouvelle demande de congé", 
                        $"Une nouvelle demande de congé a été soumise.", 
                        "conge_request");
                }
                catch
                {
                    // Ignore notification errors
                }
            }
            
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] DemandeCongeCore entity)
        {
            if (entity == null) return BadRequest("Données invalides");
            var result = await _business.AjouterOuModifierAsync(entity);
            
            if (result.Success)
            {
                // Notify User of the status update (fire and forget, don't fail if notification fails)
                try
                {
                    await _notificationService.SendToUserAsync(
                        entity.UtilisateurId, 
                        "Statut de congé mis à jour", 
                        $"Votre demande de congé a été mise à jour.", 
                        "conge_update");
                }
                catch
                {
                    // Ignore notification errors
                }
            }
            
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _business.SupprimerAsync(id);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
