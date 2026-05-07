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
    [Route("api/societes")]
    [Route("api/societe")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAll")]
    public class SocieteController : ControllerBase
    {
        private readonly ISocieteBusiness _societeBusiness;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _coreApiUrl;

        public SocieteController(ISocieteBusiness societeBusiness, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _societeBusiness = societeBusiness;
            _httpClientFactory = httpClientFactory;
            _coreApiUrl = configuration.GetSection("URL").GetValue<string>("ApiParamSociete") ?? "http://localhost:5050";
        }

        private HttpClient GetClient() => _httpClientFactory.CreateClient("ApiParamSociete");

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _societeBusiness.ListeAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtenir(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _societeBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Societe introuvable") : Ok(r);
        }

        [HttpGet("obtenir/id/{id}")]
        public async Task<IActionResult> ObtenirParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var r = await _societeBusiness.ObtenirAsync(id);
            return r == null ? NotFound("Societe introuvable") : Ok(r);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<IActionResult> AjouterOuModifier([FromBody] SocieteCore entity)
        {
            if (!ModelState.IsValid)
            {
                var errors = string.Join(" | ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return BadRequest($"Données invalides : {errors}");
            }

            if (entity == null) return BadRequest("Données Societe invalides (Body null)");

            if (string.IsNullOrWhiteSpace(entity.Nom) || entity.Nom.Length < 2)
                return BadRequest("Le nom de la société doit contenir au moins 2 caractères");

            var result = await _societeBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SocieteCore entity)
        {
            if (entity == null) return BadRequest("Données Societe invalides");
            if (string.IsNullOrWhiteSpace(entity.Nom) || entity.Nom.Length < 2)
                return BadRequest("Le nom de la société doit contenir au moins 2 caractères");
            entity.Id = string.IsNullOrWhiteSpace(entity.Id) ? string.Empty : entity.Id;
            var result = await _societeBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPost("ajouter")]
        public async Task<IActionResult> Ajouter([FromBody] SocieteCore entity)
        {
            if (entity == null) return BadRequest("Données Societe invalides");
            entity.Id = string.Empty;
            var result = await _societeBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] SocieteCore entity)
        {
            if (entity == null) return BadRequest("Données Societe invalides");
            var result = await _societeBusiness.AjouterOuModifierAsync(entity);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpPut("modifier")]
        public async Task<IActionResult> Modifier([FromBody] SocieteCore entity)
        {
            if (entity == null) return BadRequest("Données Societe invalides");
            if (string.IsNullOrWhiteSpace(entity.Id)) return BadRequest("Id de la société requis pour la modification");

            try
            {
                // Fetch existing to preserve fields not sent by the frontend
                var existing = await _societeBusiness.ObtenirAsync(entity.Id);
                if (existing != null)
                {
                    entity.Nom = entity.Nom ?? existing.Nom;
                    entity.Adresse = entity.Adresse ?? existing.Adresse;
                    entity.Email = entity.Email ?? existing.Email;
                    entity.TelephoneContact = entity.TelephoneContact ?? existing.TelephoneContact;
                    entity.Ville = entity.Ville ?? existing.Ville;
                    entity.Pays = entity.Pays ?? existing.Pays;
                    entity.PlanAbonnement = entity.PlanAbonnement ?? existing.PlanAbonnement;
                    entity.Actif = entity.Actif ?? existing.Actif;
                    entity.CodePostale = entity.CodePostale ?? existing.CodePostale;
                    entity.PersonneContact = entity.PersonneContact ?? existing.PersonneContact;
                    entity.Fax = entity.Fax ?? existing.Fax;
                    entity.SiteWeb = entity.SiteWeb ?? existing.SiteWeb;
                }

                var result = await _societeBusiness.AjouterOuModifierAsync(entity);
                return result.Success ? Ok(result.Message) : BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Erreur modification société: {ex.Message}" });
            }
        }

        [HttpPost("ListeParCritere")]
        public async Task<IActionResult> ListeParCritere([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            return Ok(await _societeBusiness.ListeParCritereAsync(critere));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _societeBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("supprimer/id/{id}")]
        public async Task<IActionResult> SupprimerParId(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            var result = await _societeBusiness.SupprimerAsync(id);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<IActionResult> SupprimerParCondition([FromBody] ConditionRecherche critere)
        {
            if (critere == null) return BadRequest("Critère manquant");
            if (critere.Criteres == null || !critere.Criteres.Any()) return BadRequest("Au moins un critère requis");
            var result = await _societeBusiness.SupprimerParConditionAsync(critere);
            return result.Success ? Ok(result.Message) : BadRequest(result.Message);
        }

        [HttpGet("ListeParPage")]
        public async Task<IActionResult> ListeParPage([FromQuery] int pageNumero = 1, [FromQuery] int pageTaille = 20)
            => Ok(await _societeBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<IActionResult> ListeParPageRoute(int pageNumero, int pageTaille)
            => Ok(await _societeBusiness.ListeParPageAsync(pageNumero, pageTaille));

        [HttpPut("{id}/modules")]
        public async Task<IActionResult> UpdateModules(string id, [FromBody] dynamic body)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");
            string modules = body?.enabledModules?.ToString() ?? "[]";

            // Persistance via Activite (Action spéciale pour retrouver la config)
            var activite = new
            {
                Id = Guid.NewGuid().ToString(),
                Action = "SOCIETE_MODULES_CONFIG",
                Description = modules,
                Type = "Config",
                SocieteId = id,
                UtilisateurId = "System",
                Date = DateTime.Now
            };

            try
            {
                await GetClient().PostAsJsonAsync($"{_coreApiUrl}/api/Activite", activite);
                return Ok(new { success = true, message = "Modules enregistrés" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}/modules")]
        public async Task<IActionResult> GetModules(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return BadRequest("Id requis");

            try
            {
                var response = await GetClient().GetAsync($"{_coreApiUrl}/api/Activite");
                if (!response.IsSuccessStatusCode) return Ok(new List<string>());

                var allActivities = await response.Content.ReadFromJsonAsync<List<dynamic>>();
                var lastConfig = allActivities?
                    .Where(a => a.societeId == id && a.action == "SOCIETE_MODULES_CONFIG")
                    .OrderByDescending(a => a.date)
                    .FirstOrDefault();

                if (lastConfig != null)
                {
                    var desc = lastConfig.description.ToString();
                    return Ok(Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(desc));
                }

                return Ok(new List<string>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("Inscription")]
        public async Task<IActionResult> Inscription([FromBody] InscriptionRequest request)
        {
            if (request?.Societe == null || request?.Admin == null)
                return BadRequest("Données invalides");

            if (string.IsNullOrWhiteSpace(request.Societe.Nom))
                return BadRequest("Le nom de la société est requis");

            if (string.IsNullOrWhiteSpace(request.Admin.Email) || !IsValidEmail(request.Admin.Email))
                return BadRequest("Email administrateur invalide");

            if (string.IsNullOrWhiteSpace(request.Admin.MotDePasse) || request.Admin.MotDePasse.Length < 8)
                return BadRequest("Le mot de passe doit contenir au moins 8 caractères");

            try
            {
                var societeId = "SOC_" + Guid.NewGuid().ToString("N")[..8].ToUpper();
                var utilisateurId = "USR_" + Guid.NewGuid().ToString("N")[..8].ToUpper();
                var typeUtilisateurId = "T002";

                var societe = new SocieteCore
                {
                    Id = societeId,
                    Nom = request.Societe.Nom,
                    Adresse = request.Societe.Adresse ?? "",
                    PlanAbonnement = request.Societe.PlanAbonnement ?? "Basic",
                    Actif = true,
                    // Email = request.Societe.Email ?? request.Admin.Email,
                    // TelephoneContact = request.Societe.TelephoneContact ?? "",
                    // Ville = request.Societe.Ville ?? "",
                    // Pays = request.Societe.Pays ?? ""
                };

                var resultSociete = await _societeBusiness.AjouterOuModifierAsync(societe);
                if (!resultSociete.Success)
                    return BadRequest($"Erreur création société: {resultSociete.Message}");

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Admin.MotDePasse);

                var admin = new UtilisateurCore
                {
                    Id = utilisateurId,
                    Nom = request.Admin.Nom,
                    Email = request.Admin.Email,
                    MotDePasse = hashedPassword,
                    TypeUtilisateurId = typeUtilisateurId,
                    SocieteId = societeId,
                    Actif = true
                };

                return Ok(new
                {
                    success = true,
                    message = "Société créée avec succès",
                    societeId = societeId,
                    adminId = utilisateurId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Erreur: {ex.Message}" });
            }
        }
    }

    public class InscriptionRequest
    {
        public SocieteCore Societe { get; set; } = new();
        public AdminRequest Admin { get; set; } = new();
    }

    public class AdminRequest
    {
        public string Nom { get; set; } = "";
        public string Email { get; set; } = "";
        public string MotDePasse { get; set; } = "";
    }
}
