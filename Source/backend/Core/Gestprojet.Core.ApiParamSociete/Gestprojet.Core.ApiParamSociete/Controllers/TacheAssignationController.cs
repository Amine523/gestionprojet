using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
        [Route("/api/tacheassignation")]
        [ApiController]
        public class TacheAssignationController : ControllerBase
    {
        private readonly ITacheAssignationCoreBusiness _tacheassignationCoreBusiness;
        private readonly ILogger<TacheAssignationController> _logger;

        public TacheAssignationController(
            ITacheAssignationCoreBusiness tacheassignationCoreBusiness,
            ILogger<TacheAssignationController> logger)
        {
            _tacheassignationCoreBusiness = tacheassignationCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter TacheAssignation.
        /// </summary>
        /// <param name="tacheassignationCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterTacheAssignation([FromBody] TacheAssignationCore tacheassignationCore)
        {
            var resultat = await _tacheassignationCoreBusiness.AjouterTacheAssignationAsync(tacheassignationCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier TacheAssignation.
        /// </summary>
        /// <param name="tacheassignationCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierTacheAssignation([FromBody] TacheAssignationCore tacheassignationCore)
        {
            var resultat = await _tacheassignationCoreBusiness.ModifierTacheAssignationAsync(tacheassignationCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer TacheAssignation.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerTacheAssignation([FromRoute] string id)
        {
            var resultat = await _tacheassignationCoreBusiness.SupprimerTacheAssignationAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer TacheAssignation par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerTacheAssignationParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheassignationCoreBusiness.SupprimerTacheAssignationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir TacheAssignation.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<TacheAssignationCore>> ObtenirTacheAssignationParId([FromRoute] string id)
        {
            var resultat = await _tacheassignationCoreBusiness.ObtenirTacheAssignationParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TacheAssignation.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<TacheAssignationCore>>> ListeTacheAssignation()
        {
            List<TacheAssignationCore> resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TacheAssignation par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<TacheAssignationCore>>> ListeTacheAssignationParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<TacheAssignationCore> resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<TacheAssignationCore>>> GetAll()
        {
            List<TacheAssignationCore> resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<TacheAssignationCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeDetaille")]
        public async Task<ActionResult<List<TacheAssignationCore>>> ListeDetaille()
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<ActionResult<List<TacheAssignationCore>>> ListeDetailleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeDetailleParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeDetailleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _tacheassignationCoreBusiness.SupprimerTacheAssignationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] TacheAssignationCore tacheassignationCore)
        {
            if (string.IsNullOrEmpty(tacheassignationCore.Id))
            {
                var resultat = await _tacheassignationCoreBusiness.AjouterTacheAssignationAsync(tacheassignationCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _tacheassignationCoreBusiness.ModifierTacheAssignationAsync(tacheassignationCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TacheAssignationCore>> GetById([FromRoute] string id)
        {
            var resultat = await _tacheassignationCoreBusiness.ObtenirTacheAssignationParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TacheAssignation avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeTacheAssignationParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste TacheAssignation par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TacheAssignationCore>>> ListeTacheAssignationParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _tacheassignationCoreBusiness.ListeTacheAssignationParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ITacheAssignationCoreBusiness, TacheAssignationCoreBusiness>();
    builder.Services.AddScoped<ITacheAssignationCoreRepository, TacheAssignationCoreRepository>();
 
*/
