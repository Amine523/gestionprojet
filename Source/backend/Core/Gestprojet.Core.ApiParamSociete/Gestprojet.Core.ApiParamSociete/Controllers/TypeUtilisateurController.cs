using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/utilisateurs/types")]
    [Route("api/typeutilisateur")]
    [Route("api/typeutilisateurs")]
        [ApiController]
        public class TypeUtilisateurController : ControllerBase
    {
        private readonly ITypeUtilisateurCoreBusiness _typeutilisateurCoreBusiness;
        private readonly ILogger<TypeUtilisateurController> _logger;

        public TypeUtilisateurController(
            ITypeUtilisateurCoreBusiness typeutilisateurCoreBusiness,
            ILogger<TypeUtilisateurController> logger)
        {
            _typeutilisateurCoreBusiness = typeutilisateurCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter TypeUtilisateur.
        /// </summary>
        /// <param name="typeutilisateurCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterTypeUtilisateur([FromBody] TypeUtilisateurCore typeutilisateurCore)
        {
            var resultat = await _typeutilisateurCoreBusiness.AjouterTypeUtilisateurAsync(typeutilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier TypeUtilisateur.
        /// </summary>
        /// <param name="typeutilisateurCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierTypeUtilisateur([FromBody] TypeUtilisateurCore typeutilisateurCore)
        {
            var resultat = await _typeutilisateurCoreBusiness.ModifierTypeUtilisateurAsync(typeutilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer TypeUtilisateur.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerTypeUtilisateur([FromRoute] string id)
        {
            var resultat = await _typeutilisateurCoreBusiness.SupprimerTypeUtilisateurAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer TypeUtilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerTypeUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeutilisateurCoreBusiness.SupprimerTypeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir TypeUtilisateur.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<TypeUtilisateurCore>> ObtenirTypeUtilisateurParId([FromRoute] string id)
        {
            var resultat = await _typeutilisateurCoreBusiness.ObtenirTypeUtilisateurParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TypeUtilisateur.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        [HttpGet]
        public async Task<ActionResult<List<TypeUtilisateurCore>>> ListeTypeUtilisateur()
        {
            List<TypeUtilisateurCore> resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TypeUtilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<TypeUtilisateurCore>>> ListeTypeUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<TypeUtilisateurCore> resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<TypeUtilisateurCore>>> GetAll()
        {
            List<TypeUtilisateurCore> resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<TypeUtilisateurCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<TypeUtilisateurCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<TypeUtilisateurCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeutilisateurCoreBusiness.SupprimerTypeUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] TypeUtilisateurCore typeutilisateurCore)
        {
            if (string.IsNullOrEmpty(typeutilisateurCore.Id))
            {
                var resultat = await _typeutilisateurCoreBusiness.AjouterTypeUtilisateurAsync(typeutilisateurCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _typeutilisateurCoreBusiness.ModifierTypeUtilisateurAsync(typeutilisateurCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TypeUtilisateurCore>> GetById([FromRoute] string id)
        {
            var resultat = await _typeutilisateurCoreBusiness.ObtenirTypeUtilisateurParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TypeUtilisateur avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TypeUtilisateurCore>>> ListeTypeUtilisateurParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TypeUtilisateur par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TypeUtilisateurCore>>> ListeTypeUtilisateurParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _typeutilisateurCoreBusiness.ListeTypeUtilisateurParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ITypeUtilisateurCoreBusiness, TypeUtilisateurCoreBusiness>();
    builder.Services.AddScoped<ITypeUtilisateurCoreRepository, TypeUtilisateurCoreRepository>();
 
*/

