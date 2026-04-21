using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/utilisateurs")]
    [Route("api/utilisateur")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class UtilisateurController : ControllerBase
    {
        private readonly IUtilisateurBusiness _utilisateurBusiness;

        public UtilisateurController(IUtilisateurBusiness utilisateurBusiness)
            => _utilisateurBusiness = utilisateurBusiness;

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données Utilisateur invalides");
            if (string.IsNullOrWhiteSpace(entity.Nom) || entity.Nom.Length < 3)
                return BadRequest("Le nom doit contenir au moins 3 caractères");
            if (string.IsNullOrWhiteSpace(entity.Email))
                return BadRequest("L'email est requis");
            if (!IsValidEmail(entity.Email))
                return BadRequest("Format d'email invalide");
            entity.Id = string.IsNullOrWhiteSpace(entity.Id) ? string.Empty : entity.Id;
            var result = await _utilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données Utilisateur invalides");
            var result = await _utilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] UtilisateurCore entity)
        {
            if (entity == null) return BadRequest("Données Utilisateur invalides");
            
            if (string.IsNullOrWhiteSpace(entity.Nom) || entity.Nom.Length < 3)
                return BadRequest("Le nom doit contenir au moins 3 caractères");
            
            if (string.IsNullOrWhiteSpace(entity.Email))
                return BadRequest("L'email est requis");
            
            if (!IsValidEmail(entity.Email))
                return BadRequest("Format d'email invalide");
            
            if (!string.IsNullOrWhiteSpace(entity.MotDePasse) && entity.MotDePasse.Length < 4)
                return BadRequest("Le mot de passe doit contenir au moins 4 caractères");
            
            var result = await _utilisateurBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _utilisateurBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _utilisateurBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Utilisateur introuvable") : Ok(r);
        }

        [HttpGet("ListeDetaille")]
        public async Task<IActionResult> ListeDetaille()
            => Ok(await _utilisateurBusiness.ListeDetailleAsync());

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _utilisateurBusiness.ListeParCritereAsync(critere));
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<IActionResult> ListeDetailleParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _utilisateurBusiness.ListeDetailleParConditionAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _utilisateurBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _utilisateurBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _utilisateurBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeParConditionParPage")]
        public async Task<IActionResult> ListeParConditionParPage([FromBody] ConditionRecherche critere, [FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _utilisateurBusiness.ListeParConditionParPageAsync(critere, pageNumero, pageTaille));
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<IActionResult> ListeDetailleParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10)
            => Ok(await _utilisateurBusiness.ListeDetailleParPageAsync(pageNumero, pageTaille));

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<IActionResult> ListeDetailleParConditionParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 10, [FromBody] ConditionRecherche critere = null)
        {
            var result = await _utilisateurBusiness.ListeDetailleParConditionParPageAsync(critere ?? new ConditionRecherche(), pageNumero, pageTaille);
            return Ok(result);
        }

        [HttpPost("ModifierMotDePasseConnecte")]
        public async Task<IActionResult> ModifierMotDePasseConnecte([FromBody] PasswordConnecteRequest request)
        {
            if (request == null) return BadRequest("Données manquantes");
            if (string.IsNullOrWhiteSpace(request.Id)) return BadRequest("ID utilisateur requis");
            if (string.IsNullOrWhiteSpace(request.AncienMotDePasse)) return BadRequest("Ancien mot de passe requis");
            if (string.IsNullOrWhiteSpace(request.NouveauMotDePasse)) return BadRequest("Nouveau mot de passe requis");
            if (request.NouveauMotDePasse.Length < 4) return BadRequest("Le nouveau mot de passe doit contenir au moins 4 caractères");
            
            var result = await _utilisateurBusiness.ModifierMotDePasseConnecteAsync(request.Id, request.AncienMotDePasse, request.NouveauMotDePasse);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ModifierMotDePasseHorsLigne")]
        public async Task<IActionResult> ModifierMotDePasseHorsLigne([FromBody] PasswordHorsLigneRequest request)
        {
            if (request == null) return BadRequest("Données manquantes");
            if (string.IsNullOrWhiteSpace(request.Email)) return BadRequest("Email requis");
            if (!IsValidEmail(request.Email)) return BadRequest("Format d'email invalide");
            if (string.IsNullOrWhiteSpace(request.NouveauMotDePasse)) return BadRequest("Nouveau mot de passe requis");
            if (request.NouveauMotDePasse.Length < 4) return BadRequest("Le nouveau mot de passe doit contenir au moins 4 caractères");
            
            var result = await _utilisateurBusiness.ModifierMotDePasseHorsLigneAsync(request.Email, request.NouveauMotDePasse);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ParSociete/{societeId}")]
        public async Task<IActionResult> GetUtilisateursParSociete(string societeId)
        {
            if (string.IsNullOrWhiteSpace(societeId)) return BadRequest("SocieteId requis");
            var critere = new ConditionRecherche
            {
                Criteres = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "SocieteId", societeId }
                }
            };
            return Ok(await _utilisateurBusiness.ListeParCritereAsync(critere));
        }
    }

    public class PasswordConnecteRequest
    {
        public string Id { get; set; }
        public string AncienMotDePasse { get; set; }
        public string NouveauMotDePasse { get; set; }
    }

    public class PasswordHorsLigneRequest
    {
        public string Email { get; set; }
        public string NouveauMotDePasse { get; set; }
    }
}