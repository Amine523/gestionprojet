using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/attachement")]
    [ApiController]
    public class AttachementController : ControllerBase
    {
        private readonly IAttachementCoreBusiness _attachementCoreBusiness;
        private readonly ILogger<AttachementController> _logger;

        public AttachementController(
            IAttachementCoreBusiness attachementCoreBusiness,
            ILogger<AttachementController> logger)
        {
            _attachementCoreBusiness = attachementCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter Attachement.
        /// </summary>
        /// <param name="attachementCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterAttachement([FromBody] AttachementCore attachementCore)
        {
            var resultat = await _attachementCoreBusiness.AjouterAttachementAsync(attachementCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Attachement.
        /// </summary>
        /// <param name="attachementCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierAttachement([FromBody] AttachementCore attachementCore)
        {
            var resultat = await _attachementCoreBusiness.ModifierAttachementAsync(attachementCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Attachement.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerAttachement([FromRoute] string id)
        {
            var resultat = await _attachementCoreBusiness.SupprimerAttachementAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Attachement par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerAttachementParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _attachementCoreBusiness.SupprimerAttachementParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Attachement.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<AttachementCore>> ObtenirAttachementParId([FromRoute] string id)
        {
            var resultat = await _attachementCoreBusiness.ObtenirAttachementParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Attachement.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        public async Task<ActionResult<List<AttachementCore>>> ListeAttachement()
        {
            List<AttachementCore> resultat = await _attachementCoreBusiness.ListeAttachementAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Attachement par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<AttachementCore>>> ListeAttachementParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<AttachementCore> resultat = await _attachementCoreBusiness.ListeAttachementParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Attachement avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<AttachementCore>>> ListeAttachementParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _attachementCoreBusiness.ListeAttachementParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Attachement par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<AttachementCore>>> ListeAttachementParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _attachementCoreBusiness.ListeAttachementParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IAttachementCoreBusiness, AttachementCoreBusiness>();
    builder.Services.AddScoped<IAttachementCoreRepository, AttachementCoreRepository>();
 
*/
