using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/demandesconge")]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class DemandeCongeController : ControllerBase
    {
        private readonly IDemandeCongeBusiness _business;
        private readonly Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService _notificationService;

        public DemandeCongeController(IDemandeCongeBusiness business, Gestprojet.Metier.ApiParamSociete.WebApi.Services.INotificationService notificationService)
        {
            _business = business;
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _business.ListeAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DemandeCongeCore entity)
        {
            if (entity == null) return BadRequest("Données invalides");
            var result = await _business.AjouterOuModifierAsync(entity);
            
            if (result.Success)
            {
                // Notify RH of the societe
                await _notificationService.SendToSocieteAsync(
                    entity.SocieteId, 
                    "Nouvelle demande de congé", 
                    $"Une nouvelle demande de congé a été soumise.", 
                    "conge_request");
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
                // Notify User of the status update
                await _notificationService.SendToUserAsync(
                    entity.UtilisateurId, 
                    "Statut de congé mis à jour", 
                    $"Votre demande de congé a été mise à jour.", 
                    "conge_update");
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
