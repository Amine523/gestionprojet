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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] Microsoft.AspNetCore.Http.IFormFile file, [FromForm] string referenceId, [FromForm] string type)
        {
            try
            {
                // Validation des paramètres
                if (file == null || file.Length == 0)
                {
                    System.Console.WriteLine("[ATTACHEMENT] Erreur: Fichier manquant ou vide");
                    return BadRequest("Fichier manquant ou vide");
                }

                // Validation de la taille du fichier (max 10 MB)
                if (file.Length > 10 * 1024 * 1024)
                {
                    System.Console.WriteLine($"[ATTACHEMENT] Erreur: Fichier trop volumineux ({file.Length} bytes)");
                    return BadRequest("Le fichier dépasse la taille maximale autorisée (10 MB)");
                }

                // Validation du type de fichier
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    System.Console.WriteLine($"[ATTACHEMENT] Erreur: Type de fichier non autorisé ({fileExtension})");
                    return BadRequest($"Type de fichier non autorisé. Extensions autorisées: {string.Join(", ", allowedExtensions)}");
                }

                System.Console.WriteLine($"[ATTACHEMENT] Upload: FileName={file.FileName}, Size={file.Length}, ReferenceId={referenceId}, Type={type}");

                var uploads = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!System.IO.Directory.Exists(uploads)) System.IO.Directory.CreateDirectory(uploads);

                // Nettoyer le nom du fichier pour éviter les problèmes de caractères spéciaux
                var safeFileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName);
                safeFileName = string.Join("_", safeFileName.Split(System.IO.Path.GetInvalidFileNameChars()));
                var fileName = $"{System.Guid.NewGuid():N}_{safeFileName}{fileExtension}";
                var filePath = System.IO.Path.Combine(uploads, fileName);

                using (var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                System.Console.WriteLine($"[ATTACHEMENT] Fichier sauvegardé: {filePath}");

                var attachement = new AttachementCore
                {
                    Id = "", // Laisser le repository générer le code ATT-XXX
                    CheminFichier = $"/uploads/{fileName}",
                    TypeFichier = type ?? "Document",
                    TacheId = referenceId,
                    Actif = true
                };

                var result = await _attachementBusiness.AjouterOuModifierAsync(attachement);
                
                if (result.Success)
                {
                    System.Console.WriteLine($"[ATTACHEMENT] Upload réussi: {attachement.CheminFichier}");
                    return Ok(new { success = true, url = attachement.CheminFichier, id = attachement.Id });
                }
                else
                {
                    System.Console.WriteLine($"[ATTACHEMENT] Erreur lors de l'enregistrement: {result.Message}");
                    return BadRequest(result.Message);
                }
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[ATTACHEMENT] Exception: {ex.Message}\n{ex.StackTrace}");
                return BadRequest($"Erreur lors de l'upload: {ex.Message}");
            }
        }
    }
}
