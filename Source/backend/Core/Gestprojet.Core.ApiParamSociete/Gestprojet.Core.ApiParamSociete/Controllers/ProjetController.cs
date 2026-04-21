using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/projets")]
    [ApiController]
    public class ProjetController : ControllerBase
    {
        private readonly IProjetCoreBusiness _projetCoreBusiness;
        private readonly ILogger<ProjetController> _logger;

        public ProjetController(
            IProjetCoreBusiness projetCoreBusiness,
            ILogger<ProjetController> logger)
        {
            _projetCoreBusiness = projetCoreBusiness;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ResultatPage<ProjetCore>>> GetProjets([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        /// <summary>
        /// Ajouter Projet.
        /// </summary>
        /// <param name="projetCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterProjet([FromBody] ProjetCore projetCore)
        {
            var resultat = await _projetCoreBusiness.AjouterProjetAsync(projetCore);
            return Ok(resultat);
        }

        [HttpPost("AjouterOuModifier")]
        public async Task<ActionResult<bool>> AjouterOuModifier([FromBody] ProjetCore projetCore)
        {
            if (projetCore == null) return BadRequest(false);
            bool resultat;
            if (string.IsNullOrEmpty(projetCore.Id))
            {
                resultat = await _projetCoreBusiness.AjouterProjetAsync(projetCore);
            }
            else
            {
                resultat = await _projetCoreBusiness.ModifierProjetAsync(projetCore);
            }
            return Ok(resultat);
        }

        [HttpGet("ParSociete/{societeId}")]
        public async Task<ActionResult> GetProjetsParSociete(string societeId)
        {
            var critere = new CritereRecherche
            {
                Propriete = "SocieteId",
                Operateur = "=",
                Valeur = societeId
            };
            var resultat = await _projetCoreBusiness.ListeProjetParConditionAsync(critere);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier Projet.
        /// </summary>
        /// <param name="projetCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierProjet([FromBody] ProjetCore projetCore)
        {
            var resultat = await _projetCoreBusiness.ModifierProjetAsync(projetCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Projet.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerProjet([FromRoute] string id)
        {
            var resultat = await _projetCoreBusiness.SupprimerProjetAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer Projet par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerProjetParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _projetCoreBusiness.SupprimerProjetParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir Projet.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<ProjetCore>> ObtenirProjetParId([FromRoute] string id)
        {
            var resultat = await _projetCoreBusiness.ObtenirProjetParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Projet.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        public async Task<ActionResult<List<ProjetCore>>> ListeProjet()
        {
            List<ProjetCore> resultat = await _projetCoreBusiness.ListeProjetAsync();
            return Ok(resultat);
        }

        [HttpPost("ListeParCritere")]
        public async Task<ActionResult<List<ProjetCore>>> ListeParCritere([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpPost("ListeParCondition")]
        public async Task<ActionResult<List<ProjetCore>>> ListeParCondition([FromBody] CritereRecherche? critereRecherche)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParConditionAsync(critereRecherche ?? new CritereRecherche());
            return Ok(resultat);
        }

        [HttpGet("ListeParPage")]
        public async Task<ActionResult<ResultatPage<ProjetCore>>> ListeParPage([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParPageAsync(page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("ListeParConditionParPage")]
        public async Task<ActionResult<ResultatPage<ProjetCore>>> ListeParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParConditionParPageAsync(critereRecherche, page, pageSize);
            return Ok(resultat);
        }

        [HttpPost("SupprimerParCondition")]
        public async Task<ActionResult<bool>> SupprimerParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _projetCoreBusiness.SupprimerProjetParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjetCore>> GetById([FromRoute] string id)
        {
            var resultat = await _projetCoreBusiness.ObtenirProjetParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Projet par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<ProjetCore>>> ListeProjetParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<ProjetCore> resultat = await _projetCoreBusiness.ListeProjetParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Projet avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ProjetCore>>> ListeProjetParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste Projet par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ProjetCore>>> ListeProjetParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _projetCoreBusiness.ListeProjetParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IProjetCoreBusiness, ProjetCoreBusiness>();
    builder.Services.AddScoped<IProjetCoreRepository, ProjetCoreRepository>();
 
*/
