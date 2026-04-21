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
        private readonly ILogger<TacheController> _logger;

        public TacheController(
            ITacheCoreBusiness tacheCoreBusiness,
            ILogger<TacheController> logger)
        {
            _tacheCoreBusiness = tacheCoreBusiness;
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
            var resultat = await _tacheCoreBusiness.AjouterTacheAsync(tacheCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Tache.
        /// </summary>
        /// <param name="tacheCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierTache([FromBody] TacheCore tacheCore)
        {
            var resultat = await _tacheCoreBusiness.ModifierTacheAsync(tacheCore);
            return Ok(resultat);
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
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ITacheCoreBusiness, TacheCoreBusiness>();
    builder.Services.AddScoped<ITacheCoreRepository, TacheCoreRepository>();
 
*/
