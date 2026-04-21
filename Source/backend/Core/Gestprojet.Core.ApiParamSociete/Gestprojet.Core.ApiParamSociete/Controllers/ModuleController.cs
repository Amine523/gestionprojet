using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/module")]
    [ApiController]
        public class ModuleController : ControllerBase
    {
        private readonly IModuleCoreBusiness _moduleCoreBusiness;
        private readonly ILogger<ModuleController> _logger;

        public ModuleController(
            IModuleCoreBusiness moduleCoreBusiness,
            ILogger<ModuleController> logger)
        {
            _moduleCoreBusiness = moduleCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Module.
        /// </summary>
        /// <param name="moduleCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterModule([FromBody] ModuleCore moduleCore)
        {
            var resultat = await _moduleCoreBusiness.AjouterModuleAsync(moduleCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Module.
        /// </summary>
        /// <param name="moduleCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierModule([FromBody] ModuleCore moduleCore)
        {
            var resultat = await _moduleCoreBusiness.ModifierModuleAsync(moduleCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Module.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerModule([FromRoute] string id)
        {
            var resultat = await _moduleCoreBusiness.SupprimerModuleAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Module par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerModuleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _moduleCoreBusiness.SupprimerModuleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Module.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<ModuleCore>> ObtenirModuleParId([FromRoute] string id)
        {
            var resultat = await _moduleCoreBusiness.ObtenirModuleParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Module.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<ModuleCore>>> ListeModule()
        {
            List<ModuleCore> resultat = await _moduleCoreBusiness.ListeModuleAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Module par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<ModuleCore>>> ListeModuleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<ModuleCore> resultat = await _moduleCoreBusiness.ListeModuleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<ModuleCore>>> GetAll()
        {
            List<ModuleCore> resultat = await _moduleCoreBusiness.ListeModuleAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<ModuleCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _moduleCoreBusiness.ListeModuleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<ModuleCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _moduleCoreBusiness.ListeModuleParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<ModuleCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _moduleCoreBusiness.ListeModuleParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _moduleCoreBusiness.SupprimerModuleParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] ModuleCore moduleCore)
        {
            if (string.IsNullOrEmpty(moduleCore.Id))
            {
                var resultat = await _moduleCoreBusiness.AjouterModuleAsync(moduleCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _moduleCoreBusiness.ModifierModuleAsync(moduleCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ModuleCore>> GetById([FromRoute] string id)
        {
            var resultat = await _moduleCoreBusiness.ObtenirModuleParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Module avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ModuleCore>>> ListeModuleParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _moduleCoreBusiness.ListeModuleParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Module par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ModuleCore>>> ListeModuleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _moduleCoreBusiness.ListeModuleParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IModuleCoreBusiness, ModuleCoreBusiness>();
    builder.Services.AddScoped<IModuleCoreRepository, ModuleCoreRepository>();
 
*/
