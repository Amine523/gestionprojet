using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/utilisateurs")]
    [ApiController]
    [AllowAnonymous]
    public class UtilisateurController : ControllerBase
    {
        private readonly IUtilisateurCoreBusiness _utilisateurCoreBusiness;
        private readonly ILogger<UtilisateurController> _logger;

        public UtilisateurController(
            IUtilisateurCoreBusiness utilisateurCoreBusiness,
            ILogger<UtilisateurController> logger)
        {
            _utilisateurCoreBusiness = utilisateurCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter ou Modifier Utilisateur.
        /// </summary>
        /// <param name="utilisateurCore"></param>
        /// <returns></returns>
        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifierUtilisateur([FromBody] UtilisateurCore utilisateurCore)
        {
            if (string.IsNullOrEmpty(utilisateurCore.Id))
            {
                var resultat = await _utilisateurCoreBusiness.AjouterUtilisateurAsync(utilisateurCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _utilisateurCoreBusiness.ModifierUtilisateurAsync(utilisateurCore);
                return Ok(resultat);
            }
        }

        /// <summary>
        /// Ajouter Utilisateur.
        /// </summary>
        /// <param name="utilisateurCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterUtilisateur([FromBody] UtilisateurCore utilisateurCore)
        {
            var resultat = await _utilisateurCoreBusiness.AjouterUtilisateurAsync(utilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Utilisateur.
        /// </summary>
        /// <param name="utilisateurCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierUtilisateur([FromBody] UtilisateurCore utilisateurCore)
        {
            var resultat = await _utilisateurCoreBusiness.ModifierUtilisateurAsync(utilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Utilisateur.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerUtilisateur([FromRoute] string id)
        {
            var resultat = await _utilisateurCoreBusiness.SupprimerUtilisateurAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Utilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _utilisateurCoreBusiness.SupprimerUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir l'utilisateur actuel.
        /// </summary>
        /// <returns></returns>
        [HttpGet("me")]
        public ActionResult<UtilisateurCore> GetMe()
        {
            // For now return a dummy admin since we are in dev/test mode
            var user = new UtilisateurCore
            {
                Id = Guid.NewGuid().ToString(),
                Nom = "Admin Test",
                Email = "admin@test.com",
                Actif = true
            };
            return Ok(user);
        }

        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<UtilisateurCore>> ObtenirUtilisateurParId([FromRoute] string id)
        {
            var resultat = await _utilisateurCoreBusiness.ObtenirUtilisateurParIdAsync(id);
            return Ok(resultat);
        }

        [HttpGet]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Utilisateur.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeUtilisateur()
        {
            List<UtilisateurCore> resultat = await _utilisateurCoreBusiness.ListeUtilisateurAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("ListeParCondition")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeDetaille")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeDetaille()
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeDetailleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeDetailleParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeDetailleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _utilisateurCoreBusiness.SupprimerUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier-legacy")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] UtilisateurCore utilisateurCore)
        {
            if (string.IsNullOrEmpty(utilisateurCore.Id))
            {
                var resultat = await _utilisateurCoreBusiness.AjouterUtilisateurAsync(utilisateurCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _utilisateurCoreBusiness.ModifierUtilisateurAsync(utilisateurCore);
                return Ok(resultat);
            }
        }

        [HttpPost("ModifierMotDePasseConnecte")]
        public ActionResult<bool> ModifierMotDePasseConnecte([FromBody] object request)
        {
            return Ok(true);
        }

        [HttpPost("ModifierMotDePasseHorsLigne")]
        public ActionResult<bool> ModifierMotDePasseHorsLigne([FromBody] object request)
        {
            return Ok(true);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UtilisateurCore>> GetById([FromRoute] string id)
        {
            var resultat = await _utilisateurCoreBusiness.ObtenirUtilisateurParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Utilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<UtilisateurCore>>> ListeUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<UtilisateurCore> resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Utilisateur avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeUtilisateurParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Utilisateur par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<UtilisateurCore>>> ListeUtilisateurParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _utilisateurCoreBusiness.ListeUtilisateurParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IUtilisateurCoreBusiness, UtilisateurCoreBusiness>();
    builder.Services.AddScoped<IUtilisateurCoreRepository, UtilisateurCoreRepository>();
 
*/

