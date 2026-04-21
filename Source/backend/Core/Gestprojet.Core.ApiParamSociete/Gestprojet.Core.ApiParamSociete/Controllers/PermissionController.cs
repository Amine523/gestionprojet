using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/permission")]
    [ApiController]
        public class PermissionController : ControllerBase
    {
        private readonly IPermissionCoreBusiness _permissionCoreBusiness;
        private readonly ILogger<PermissionController> _logger;

        public PermissionController(
            IPermissionCoreBusiness permissionCoreBusiness,
            ILogger<PermissionController> logger)
        {
            _permissionCoreBusiness = permissionCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Permission.
        /// </summary>
        /// <param name="permissionCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterPermission([FromBody] PermissionCore permissionCore)
        {
            var resultat = await _permissionCoreBusiness.AjouterPermissionAsync(permissionCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Permission.
        /// </summary>
        /// <param name="permissionCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierPermission([FromBody] PermissionCore permissionCore)
        {
            var resultat = await _permissionCoreBusiness.ModifierPermissionAsync(permissionCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Permission.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerPermission([FromRoute] string id)
        {
            var resultat = await _permissionCoreBusiness.SupprimerPermissionAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Permission par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerPermissionParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _permissionCoreBusiness.SupprimerPermissionParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Permission.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<PermissionCore>> ObtenirPermissionParId([FromRoute] string id)
        {
            var resultat = await _permissionCoreBusiness.ObtenirPermissionParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Permission.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<PermissionCore>>> ListePermission()
        {
            List<PermissionCore> resultat = await _permissionCoreBusiness.ListePermissionAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Permission par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<PermissionCore>>> ListePermissionParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<PermissionCore> resultat = await _permissionCoreBusiness.ListePermissionParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<PermissionCore>>> GetAll()
        {
            List<PermissionCore> resultat = await _permissionCoreBusiness.ListePermissionAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<PermissionCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeDetaille")]
        public async Task<ActionResult<List<PermissionCore>>> ListeDetaille()
        {
            var resultat = await _permissionCoreBusiness.ListePermissionAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<ActionResult<List<PermissionCore>>> ListeDetailleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListeDetailleParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListeDetailleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _permissionCoreBusiness.SupprimerPermissionParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] PermissionCore permissionCore)
        {
            if (string.IsNullOrEmpty(permissionCore.Id))
            {
                var resultat = await _permissionCoreBusiness.AjouterPermissionAsync(permissionCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _permissionCoreBusiness.ModifierPermissionAsync(permissionCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PermissionCore>> GetById([FromRoute] string id)
        {
            var resultat = await _permissionCoreBusiness.ObtenirPermissionParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Permission avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListePermissionParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Permission par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<PermissionCore>>> ListePermissionParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _permissionCoreBusiness.ListePermissionParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IPermissionCoreBusiness, PermissionCoreBusiness>();
    builder.Services.AddScoped<IPermissionCoreRepository, PermissionCoreRepository>();
 
*/

