using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
        [Route("api/pointage")]
        [ApiController]
        public class PointageController : ControllerBase
    {
        private readonly IPointageCoreBusiness _pointageCoreBusiness;
        private readonly ILogger<PointageController> _logger;

        public PointageController(
            IPointageCoreBusiness pointageCoreBusiness,
            ILogger<PointageController> logger)
        {
            _pointageCoreBusiness = pointageCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Pointage.
        /// </summary>
        /// <param name="pointageCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterPointage([FromBody] PointageCore pointageCore)
        {
            var resultat = await _pointageCoreBusiness.AjouterPointageAsync(pointageCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Pointage.
        /// </summary>
        /// <param name="pointageCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierPointage([FromBody] PointageCore pointageCore)
        {
            var resultat = await _pointageCoreBusiness.ModifierPointageAsync(pointageCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Pointage.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerPointage([FromRoute] string id)
        {
            var resultat = await _pointageCoreBusiness.SupprimerPointageAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Pointage par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerPointageParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _pointageCoreBusiness.SupprimerPointageParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Pointage.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<PointageCore>> ObtenirPointageParId([FromRoute] string id)
        {
            var resultat = await _pointageCoreBusiness.ObtenirPointageParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Pointage.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<List<PointageCore>>> Liste()
        {
            List<PointageCore> resultat = await _pointageCoreBusiness.ListePointageAsync();
            return Ok(resultat);
        }

        [HttpGet("liste")]
        public async Task<ActionResult<List<PointageCore>>> ListePointage()
        {
            List<PointageCore> resultat = await _pointageCoreBusiness.ListePointageAsync();
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<PointageCore>>> ListePointageLegacy()
        {
            List<PointageCore> resultat = await _pointageCoreBusiness.ListePointageAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<PointageCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] PointageCore pointageCore)
        {
            if (string.IsNullOrEmpty(pointageCore.Id))
            {
                var resultat = await _pointageCoreBusiness.AjouterPointageAsync(pointageCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _pointageCoreBusiness.ModifierPointageAsync(pointageCore);
                return Ok(resultat);
            }
        }

        [HttpPost("ListeParCondition")]
        public async Task<ActionResult<List<PointageCore>>> ListeParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<PointageCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<PointageCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _pointageCoreBusiness.SupprimerPointageParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PointageCore>> GetById([FromRoute] string id)
        {
            var resultat = await _pointageCoreBusiness.ObtenirPointageParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Pointage par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<PointageCore>>> ListePointageParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<PointageCore> resultat = await _pointageCoreBusiness.ListePointageParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Pointage avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<PointageCore>>> ListePointageParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Pointage par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<PointageCore>>> ListePointageParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _pointageCoreBusiness.ListePointageParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IPointageCoreBusiness, PointageCoreBusiness>();
    builder.Services.AddScoped<IPointageCoreRepository, PointageCoreRepository>();
 
*/

