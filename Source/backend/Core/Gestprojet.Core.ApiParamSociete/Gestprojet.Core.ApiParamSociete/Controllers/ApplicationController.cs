using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
        [Route("api/application")]
        [ApiController]
        public class ApplicationController : ControllerBase
    {
        private readonly IApplicationCoreBusiness _applicationCoreBusiness;
        private readonly ILogger<ApplicationController> _logger;

        public ApplicationController(
            IApplicationCoreBusiness applicationCoreBusiness,
            ILogger<ApplicationController> logger)
        {
            _applicationCoreBusiness = applicationCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Application.
        /// </summary>
        /// <param name="applicationCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterApplication([FromBody] ApplicationCore applicationCore)
        {
            var resultat = await _applicationCoreBusiness.AjouterApplicationAsync(applicationCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Application.
        /// </summary>
        /// <param name="applicationCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierApplication([FromBody] ApplicationCore applicationCore)
        {
            var resultat = await _applicationCoreBusiness.ModifierApplicationAsync(applicationCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Application.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerApplication([FromRoute] string id)
        {
            var resultat = await _applicationCoreBusiness.SupprimerApplicationAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Application par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerApplicationParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _applicationCoreBusiness.SupprimerApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Application.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<ApplicationCore>> ObtenirApplicationParId([FromRoute] string id)
        {
            var resultat = await _applicationCoreBusiness.ObtenirApplicationParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Application.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeApplication()
        {
            List<ApplicationCore> resultat = await _applicationCoreBusiness.ListeApplicationAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("ListeDetaille")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeDetaille()
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeDetailleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeDetailleParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeDetailleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] ApplicationCore applicationCore)
        {
            if (string.IsNullOrEmpty(applicationCore.Id))
            {
                var resultat = await _applicationCoreBusiness.AjouterApplicationAsync(applicationCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _applicationCoreBusiness.ModifierApplicationAsync(applicationCore);
                return Ok(resultat);
            }
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _applicationCoreBusiness.SupprimerApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationCore>> GetById([FromRoute] string id)
        {
            var resultat = await _applicationCoreBusiness.ObtenirApplicationParIdAsync(id);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<ApplicationCore>>> Liste()
        {
            List<ApplicationCore> resultat = await _applicationCoreBusiness.ListeApplicationAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCondition")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Application par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<ApplicationCore>>> ListeApplicationParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<ApplicationCore> resultat = await _applicationCoreBusiness.ListeApplicationParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Application avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeApplicationParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Application par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ApplicationCore>>> ListeApplicationParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _applicationCoreBusiness.ListeApplicationParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IApplicationCoreBusiness, ApplicationCoreBusiness>();
    builder.Services.AddScoped<IApplicationCoreRepository, ApplicationCoreRepository>();
 
*/
