using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
        [Route("/api/type")]
        [ApiController]
        public class TypeController : ControllerBase
    {
        private readonly ITypeCoreBusiness _typeCoreBusiness;
        private readonly ILogger<TypeController> _logger;

        public TypeController(
            ITypeCoreBusiness typeCoreBusiness,
            ILogger<TypeController> logger)
        {
            _typeCoreBusiness = typeCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Type.
        /// </summary>
        /// <param name="typeCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterType([FromBody] TypeCore typeCore)
        {
            var resultat = await _typeCoreBusiness.AjouterTypeAsync(typeCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Type.
        /// </summary>
        /// <param name="typeCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierType([FromBody] TypeCore typeCore)
        {
            var resultat = await _typeCoreBusiness.ModifierTypeAsync(typeCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Type.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerType([FromRoute] string id)
        {
            var resultat = await _typeCoreBusiness.SupprimerTypeAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Type par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerTypeParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeCoreBusiness.SupprimerTypeParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Type.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<TypeCore>> ObtenirTypeParId([FromRoute] string id)
        {
            var resultat = await _typeCoreBusiness.ObtenirTypeParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Type.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<TypeCore>>> ListeType()
        {
            List<TypeCore> resultat = await _typeCoreBusiness.ListeTypeAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Type par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<TypeCore>>> ListeTypeParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<TypeCore> resultat = await _typeCoreBusiness.ListeTypeParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("liste-legacy-2")]
        public async Task<ActionResult<List<TypeCore>>> GetAll()
        {
            List<TypeCore> resultat = await _typeCoreBusiness.ListeTypeAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<TypeCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeCoreBusiness.ListeTypeParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<TypeCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _typeCoreBusiness.ListeTypeParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<TypeCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _typeCoreBusiness.ListeTypeParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpDelete("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _typeCoreBusiness.SupprimerTypeParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] TypeCore typeCore)
        {
            if (string.IsNullOrEmpty(typeCore.Id))
            {
                var resultat = await _typeCoreBusiness.AjouterTypeAsync(typeCore);
                return Ok(resultat);
            }
            else
            {
                var resultat = await _typeCoreBusiness.ModifierTypeAsync(typeCore);
                return Ok(resultat);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TypeCore>> GetById([FromRoute] string id)
        {
            var resultat = await _typeCoreBusiness.ObtenirTypeParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Type avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TypeCore>>> ListeTypeParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _typeCoreBusiness.ListeTypeParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Type par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<TypeCore>>> ListeTypeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _typeCoreBusiness.ListeTypeParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<ITypeCoreBusiness, TypeCoreBusiness>();
    builder.Services.AddScoped<ITypeCoreRepository, TypeCoreRepository>();
 
*/
