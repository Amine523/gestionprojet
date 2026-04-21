using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OffreEmploIController : ControllerBase
    {
        private readonly Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business.IApplicationCoreBusiness _applicationBusiness;

        public OffreEmploIController(Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business.IApplicationCoreBusiness applicationBusiness)
        {
            _applicationBusiness = applicationBusiness;
        }

        [HttpGet("liste")]
        public async Task<IActionResult> GetListe()
        {
            var critere = new CritereRecherche
            {
                Propriete = "Type",
                Operateur = "=",
                Valeur = "OffreEmploI"
            };
            var result = await _applicationBusiness.ListeApplicationParConditionAsync(critere);
            return Ok(result);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] ApplicationCore entity)
        {
            if (entity == null) return BadRequest(new { success = false, message = "Données invalides" });
            entity.Type = "OffreEmploI";
            var result = await _applicationBusiness.AjouterApplicationAsync(entity);
            return Ok(new { success = result, message = result ? "Offre ajoutée" : "Erreur" });
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            var result = await _applicationBusiness.SupprimerApplicationAsync(id);
            return Ok(new { success = result });
        }

        [HttpPost("initialiser")]
        public async Task<IActionResult> Initialiser()
        {
            return Ok(new { success = true, message = "Données recruitment initialisées" });
        }
    }
}