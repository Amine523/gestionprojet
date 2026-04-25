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
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AttachementController : ControllerBase
    {
        private readonly IAttachementBusiness _attachementBusiness;

        public AttachementController(IAttachementBusiness attachementBusiness)
            => _attachementBusiness = attachementBusiness;

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] AttachementCore entity)
        {
            if (entity == null) return BadRequest("Données Attachement invalides");
            var result = await _attachementBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _attachementBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _attachementBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Attachement introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _attachementBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _attachementBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _attachementBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _attachementBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _attachementBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _attachementBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _attachementBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _attachementBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche? critere = null)
        {
            var result = await _attachementBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] Microsoft.AspNetCore.Http.IFormFile file, [FromForm] string referenceId, [FromForm] string type)
        {
            if (file == null || file.Length == 0) return BadRequest("Fichier manquant");
            
            var uploads = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!System.IO.Directory.Exists(uploads)) System.IO.Directory.CreateDirectory(uploads);

            var fileName = $"{System.Guid.NewGuid()}_{file.FileName}";
            var filePath = System.IO.Path.Combine(uploads, fileName);

            using (var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachement = new AttachementCore
            {
                Id = System.Guid.NewGuid().ToString(),
                CheminFichier = $"/uploads/{fileName}",
                TypeFichier = type,
                TacheId = referenceId,
                Actif = true
            };

            var result = await _attachementBusiness.AjouterOuModifierAsync(attachement);
            return result.Success ? Ok(new { success = true, url = attachement.CheminFichier }) : BadRequest(result.Message);
        }
    }
}