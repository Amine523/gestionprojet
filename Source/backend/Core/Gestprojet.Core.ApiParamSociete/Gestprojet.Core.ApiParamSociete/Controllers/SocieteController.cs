using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/societes")]
    [ApiController]
    public class SocieteController : ControllerBase
    {
        private readonly ISocieteCoreBusiness _societeCoreBusiness;
        private readonly ILogger<SocieteController> _logger;

        public SocieteController(
            ISocieteCoreBusiness societeCoreBusiness,
            ILogger<SocieteController> logger)
        {
            _societeCoreBusiness = societeCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// GET /api/Societe - Liste toutes les sociétés
        /// </summary>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                _logger.LogInformation("GET /api/Societe called");
                var resultat = await _societeCoreBusiness.ListeSocieteAsync();
                _logger.LogInformation("Result: {Count} items", resultat?.Count ?? 0);
                return Ok(resultat ?? new List<SocieteCore>());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/Societe: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// GET /api/Societe/Liste - Liste toutes les sociétés
        /// </summary>
        [HttpGet("liste")]
        public async Task<ActionResult> Liste()
        {
            try
            {
                _logger.LogInformation("GET /api/Societe/Liste called");
                var resultat = await _societeCoreBusiness.ListeSocieteAsync();
                return Ok(resultat ?? new List<SocieteCore>());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/Societe/Liste: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// GET /api/Societe/{id} - Obtenir une société par ID
        /// </summary>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult> Obtenir(string id)
        {
            try
            {
                _logger.LogInformation("GET /api/Societe/{Id} called", id);
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { error = "ID requis" });
                    
                var resultat = await _societeCoreBusiness.ObtenirSocieteParIdAsync(id);
                if (resultat == null)
                    return NotFound(new { error = "Société introuvable" });
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/Societe/{id}: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// POST /api/Societe/AjouterOuModifier - Ajouter ou modifier une société
        /// </summary>
        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult> AjouterOuModifier([FromBody] SocieteCore societeCore)
        {
            try
            {
                _logger.LogInformation("POST /api/Societe/AjouterOuModifier called with: {Data}", JsonConvert.SerializeObject(societeCore));
                if (societeCore == null)
                    return BadRequest(new { error = "Données société invalides" });

                if (string.IsNullOrWhiteSpace(societeCore.Nom) || societeCore.Nom.Length < 2)
                    return BadRequest(new { error = "Le nom de la société doit contenir au moins 2 caractères" });

                bool resultat;
                if (string.IsNullOrWhiteSpace(societeCore.Id))
                {
                    resultat = await _societeCoreBusiness.AjouterSocieteAsync(societeCore);
                }
                else
                {
                    resultat = await _societeCoreBusiness.ModifierSocieteAsync(societeCore);
                }
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST /api/Societe/AjouterOuModifier: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpGet("Societes")]
        public async Task<ActionResult> GetSocietes()
        {
            try
            {
                var resultat = await _societeCoreBusiness.ListeSocieteAsync();
                return Ok(resultat ?? new List<SocieteCore>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("ajouter")]
        public async Task<ActionResult> AjouterSociete([FromBody] SocieteCore societeCore)
        {
            try
            {
                if (societeCore == null) return BadRequest(new { error = "Données invalides" });
                if (string.IsNullOrWhiteSpace(societeCore.Nom)) return BadRequest(new { error = "Le nom est requis" });
                var resultat = await _societeCoreBusiness.AjouterSocieteAsync(societeCore);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, trace = ex.StackTrace });
            }
        }

        [HttpPut("modifier")]
        public async Task<ActionResult> ModifierSociete([FromBody] SocieteCore societeCore)
        {
            try
            {
                if (societeCore == null) return BadRequest(new { error = "Données invalides" });
                var resultat = await _societeCoreBusiness.ModifierSocieteAsync(societeCore);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/Societe/ListeParCritere - Rechercher par critères
        /// </summary>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult> ListeParCritere([FromBody] CritereRecherche critere)
        {
            try
            {
                if (critere == null)
                    return BadRequest(new { error = "Critère manquant" });
                    
                var resultat = await _societeCoreBusiness.ListeSocieteParConditionAsync(critere);
                return Ok(resultat ?? new List<SocieteCore>());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST /api/Societe/ListeParCritere: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// DELETE /api/Societe/{id} - Supprimer une société
        /// </summary>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult> Supprimer(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { error = "ID requis" });
                    
                var resultat = await _societeCoreBusiness.SupprimerSocieteAsync(id);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DELETE /api/Societe/{id}: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// DELETE /api/Societe/SupprimerParCondition - Supprimer par condition
        /// </summary>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult> SupprimerParCondition([FromBody] CritereRecherche critere)
        {
            try
            {
                if (critere == null || critere.Criteres == null || !critere.Criteres.Any())
                    return BadRequest(new { error = "Au moins un critère requis" });
                    
                var resultat = await _societeCoreBusiness.SupprimerSocieteParConditionAsync(critere);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DELETE /api/Societe/SupprimerParCondition: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/Societe/ListeParPage?pageNumero=1&pageTaille=20 - Pagination
        /// </summary>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult> ListeParPage(int pageNumero = 1, int pageTaille = 20)
        {
            try
            {
                if (pageNumero < 1) pageNumero = 1;
                if (pageTaille < 1) pageTaille = 20;
                if (pageTaille > 100) pageTaille = 100;
                
                var resultat = await _societeCoreBusiness.ListeSocieteParPageAsync(pageNumero, pageTaille);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GET /api/Societe/ListeParPage: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// POST /api/Societe/ListeParConditionParPage - Pagination avec critères
        /// </summary>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult> ListeParConditionParPage([FromBody] CritereRecherche critere, int pageNumero = 1, int pageTaille = 20)
        {
            try
            {
                if (critere == null)
                    return BadRequest(new { error = "Critère manquant" });
                    
                if (pageNumero < 1) pageNumero = 1;
                if (pageTaille < 1) pageTaille = 20;
                if (pageTaille > 100) pageTaille = 100;
                
                var resultat = await _societeCoreBusiness.ListeSocieteParConditionParPageAsync(critere, pageNumero, pageTaille);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in POST /api/Societe/ListeParConditionParPage: {Message}", ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}

