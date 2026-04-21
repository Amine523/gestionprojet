using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/soustache")]
    [ApiController]
        public class SousTacheController : ControllerBase
    {
        private readonly ISousTacheCoreBusiness _soustacheCoreBusiness;
        private readonly ILogger<SousTacheController> _logger;

        public SousTacheController(
            ISousTacheCoreBusiness soustacheCoreBusiness,
            ILogger<SousTacheController> logger)
        {
            _soustacheCoreBusiness = soustacheCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter SousTache.
        /// </summary>
        /// <param name="soustacheCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterSousTache([FromBody] SousTacheCore soustacheCore)
        {
            var resultat = await _soustacheCoreBusiness.AjouterSousTacheAsync(soustacheCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier SousTache.
        /// </summary>
        /// <param name="soustacheCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierSousTache([FromBody] SousTacheCore soustacheCore)
        {
            var resultat = await _soustacheCoreBusiness.ModifierSousTacheAsync(soustacheCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer SousTache.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerSousTache([FromRoute] string id)
        {
            var resultat = await _soustacheCoreBusiness.SupprimerSousTacheAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer SousTache par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerSousTacheParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _soustacheCoreBusiness.SupprimerSousTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir SousTache.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<SousTacheCore>> ObtenirSousTacheParId([FromRoute] string id)
        {
            var resultat = await _soustacheCoreBusiness.ObtenirSousTacheParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste SousTache.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<SousTacheCore>>> ListeSousTache()
        {
            List<SousTacheCore> resultat = await _soustacheCoreBusiness.ListeSousTacheAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste SousTache par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<SousTacheCore>>> ListeSousTacheParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<SousTacheCore> resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<SousTacheCore>>> GetAll()
        {
            List<SousTacheCore> resultat = await _soustacheCoreBusiness.ListeSousTacheAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<SousTacheCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeDetaille")]
        public async Task<ActionResult<List<SousTacheCore>>> ListeDetaille()
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParCondition")]
        public async Task<ActionResult<List<SousTacheCore>>> ListeDetailleParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpGet("ListeDetailleParPage")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeDetailleParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeDetailleParConditionParPage")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeDetailleParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _soustacheCoreBusiness.SupprimerSousTacheParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] SousTacheCore soustacheCore)
        {
            if (string.IsNullOrEmpty(soustacheCore.Id))
            {
                var resultat = await _soustacheCoreBusiness.AjouterSousTacheAsync(soustacheCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _soustacheCoreBusiness.ModifierSousTacheAsync(soustacheCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SousTacheCore>> GetById([FromRoute] string id)
        {
            var resultat = await _soustacheCoreBusiness.ObtenirSousTacheParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste SousTache avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeSousTacheParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste SousTache par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<SousTacheCore>>> ListeSousTacheParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _soustacheCoreBusiness.ListeSousTacheParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ISousTacheCoreBusiness, SousTacheCoreBusiness>();
    builder.Services.AddScoped<ISousTacheCoreRepository, SousTacheCoreRepository>();
 
*/
