using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/taches")]
    [ApiController]
    public class TacheController : ControllerBase
    {
        private readonly ITacheCoreBusiness _tacheCoreBusiness;
        private readonly ITacheAssignationCoreBusiness _tacheassignationCoreBusiness;
        private readonly ILogger<TacheController> _logger;

        public TacheController(
            ITacheCoreBusiness tacheCoreBusiness,
            ITacheAssignationCoreBusiness tacheassignationCoreBusiness,
            ILogger<TacheController> logger)
        {
            _tacheCoreBusiness = tacheCoreBusiness;
            _tacheassignationCoreBusiness = tacheassignationCoreBusiness;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ResultatPage<TacheCore>>> GetTaches([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        /// <summary>
        /// Ajouter Tache.
        /// </summary>
        /// <param name="tacheCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterTache([FromBody] TacheCore tacheCore)
        {
            try
            {
                if (tacheCore == null)
                    return BadRequest("Le corps de la requête est vide.");
                if (string.IsNullOrWhiteSpace(tacheCore.Titre))
                    return BadRequest("Le titre de la tâche est obligatoire.");
                if (string.IsNullOrWhiteSpace(tacheCore.ProjetId))
                    return BadRequest("Le projet est obligatoire.");

                var resultat = await _tacheCoreBusiness.AjouterTacheAsync(tacheCore);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout de la tâche : {Message}", ex.Message);
                return StatusCode(500, $"Erreur interne : {ex.Message}");
            }
        }

        /// <summary>
        /// Modifier Tache.
        /// </summary>
        /// <param name="tacheCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierTache([FromBody] TacheCore tacheCore)
        {
            try
            {
                if (tacheCore == null)
                    return BadRequest("Le corps de la requête est vide.");
                if (string.IsNullOrWhiteSpace(tacheCore.Id))
                    return BadRequest("L'identifiant de la tâche est obligatoire pour une modification.");

                var resultat = await _tacheCoreBusiness.ModifierTacheAsync(tacheCore);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la modification de la tâche {Id} : {Message}", tacheCore?.Id, ex.Message);
                return StatusCode(500, $"Erreur interne : {ex.Message}");
            }
        }

        /// <summary>
        /// Supprimer Tache.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerTache([FromRoute] string id)
        {
            var resultat = await _tacheCoreBusiness.SupprimerTacheAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Tache par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerTacheParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheCoreBusiness.SupprimerTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Tache.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<TacheCore>> ObtenirTacheParId([FromRoute] string id)
        {
            var resultat = await _tacheCoreBusiness.ObtenirTacheParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Tache.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<TacheCore>>> ListeTache()
        {
            List<TacheCore> resultat = await _tacheCoreBusiness.ListeTacheAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Tache par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<TacheCore>>> ListeTacheParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<TacheCore> resultat = await _tacheCoreBusiness.ListeTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<TacheCore>>> GetAll()
        {
            List<TacheCore> resultat = await _tacheCoreBusiness.ListeTacheAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<TacheCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<TacheCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<TacheCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheCoreBusiness.SupprimerTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TacheCore>> GetById([FromRoute] string id)
        {
            var resultat = await _tacheCoreBusiness.ObtenirTacheParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Tache avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TacheCore>>> ListeTacheParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Tache par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TacheCore>>> ListeTacheParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _tacheCoreBusiness.ListeTacheParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Assigner une tâche à un utilisateur via TacheAssignation.
        /// </summary>
        [HttpPost("assigner")]
        public async Task<ActionResult<bool>> AssignerTache([FromBody] TacheAssignationCore assignation)
        {
            try
            {
                if (assignation == null || string.IsNullOrWhiteSpace(assignation.TacheId) || string.IsNullOrWhiteSpace(assignation.UtilisateurId))
                    return BadRequest("TacheId et UtilisateurId sont obligatoires.");

                // Generate ID if not provided
                if (string.IsNullOrWhiteSpace(assignation.Id))
                    assignation.Id = $"ASS-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

                assignation.Actif = true;
                var resultat = await _tacheassignationCoreBusiness.AjouterTacheAssignationAsync(assignation);
                return Ok(resultat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'assignation tâche {TacheId} -> {UtilisateurId}: {Message}",
                    assignation?.TacheId, assignation?.UtilisateurId, ex.Message);
                return StatusCode(500, $"Erreur interne : {ex.Message}");
            }
        }

        /// <summary>
        /// Récupérer les tâches assignées à un utilisateur spécifique.
        /// </summary>
        [HttpGet("par-utilisateur/{utilisateurId}")]
        public async Task<ActionResult<List<TacheCore>>> GetTachesParUtilisateur(string utilisateurId)
        {
            try
            {
                // Get all assignations for this user
                var critereAssignation = new CritereRecherche { UtilisateurId = utilisateurId };
                var assignations = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionAsync(critereAssignation);

                if (assignations == null || !assignations.Any())
                    return Ok(new List<TacheCore>());

                // Get all tasks then filter by assigned tacheIds
                var toutesLesTaches = await _tacheCoreBusiness.ListeTacheAsync();
                var tacheIds = new HashSet<string>(assignations.Select(a => a.TacheId ?? "").Where(id => !string.IsNullOrEmpty(id)));
                var tachesFiltrees = toutesLesTaches.Where(t => tacheIds.Contains(t.Id ?? "")).ToList();

                return Ok(tachesFiltrees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur GetTachesParUtilisateur({UtilisateurId}): {Message}", utilisateurId, ex.Message);
                return StatusCode(500, $"Erreur interne : {ex.Message}");
            }
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ITacheCoreBusiness, TacheCoreBusiness>();
    builder.Services.AddScoped<ITacheCoreRepository, TacheCoreRepository>();
 
*/
