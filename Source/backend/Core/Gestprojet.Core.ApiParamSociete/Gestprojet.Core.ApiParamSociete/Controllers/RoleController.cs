using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleCoreBusiness _roleCoreBusiness;
        private readonly ILogger<RoleController> _logger;

        public RoleController(
            IRoleCoreBusiness roleCoreBusiness,
            ILogger<RoleController> logger)
        {
            _roleCoreBusiness = roleCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Role.
        /// </summary>
        /// <param name="roleCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterRole([FromBody] RoleCore roleCore)
        {
            var resultat = await _roleCoreBusiness.AjouterRoleAsync(roleCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Role.
        /// </summary>
        /// <param name="roleCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierRole([FromBody] RoleCore roleCore)
        {
            var resultat = await _roleCoreBusiness.ModifierRoleAsync(roleCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerRole([FromRoute] string id)
        {
            var resultat = await _roleCoreBusiness.SupprimerRoleAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Role par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerRoleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _roleCoreBusiness.SupprimerRoleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<RoleCore>> ObtenirRoleParId([FromRoute] string id)
        {
            var resultat = await _roleCoreBusiness.ObtenirRoleParIdAsync(id);
            return Ok(resultat);
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleCore>>> GetRoles()
        {
            List<RoleCore> resultat = await _roleCoreBusiness.ListeRoleAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Role.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<RoleCore>>> ListeRole()
        {
            List<RoleCore> resultat = await _roleCoreBusiness.ListeRoleAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Role par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<RoleCore>>> ListeRoleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<RoleCore> resultat = await _roleCoreBusiness.ListeRoleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<RoleCore>>> GetAll()
        {
            List<RoleCore> resultat = await _roleCoreBusiness.ListeRoleAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<RoleCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _roleCoreBusiness.ListeRoleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<RoleCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _roleCoreBusiness.ListeRoleParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<RoleCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _roleCoreBusiness.ListeRoleParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _roleCoreBusiness.SupprimerRoleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] RoleCore roleCore)
        {
            if (string.IsNullOrEmpty(roleCore.Id))
            {
                var resultat = await _roleCoreBusiness.AjouterRoleAsync(roleCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _roleCoreBusiness.ModifierRoleAsync(roleCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleCore>> GetById([FromRoute] string id)
        {
            var resultat = await _roleCoreBusiness.ObtenirRoleParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Role avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<RoleCore>>> ListeRoleParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _roleCoreBusiness.ListeRoleParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Role par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<RoleCore>>> ListeRoleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _roleCoreBusiness.ListeRoleParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IRoleCoreBusiness, RoleCoreBusiness>();
    builder.Services.AddScoped<IRoleCoreRepository, RoleCoreRepository>();
 
*/
