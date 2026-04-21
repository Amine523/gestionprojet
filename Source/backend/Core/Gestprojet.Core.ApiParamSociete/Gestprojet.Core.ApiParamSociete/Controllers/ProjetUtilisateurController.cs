using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/projetutilisateur")]
    [ApiController]
    public class ProjetUtilisateurController : ControllerBase
    {
        private readonly IProjetUtilisateurCoreBusiness _projetutilisateurCoreBusiness;
        private readonly ILogger<ProjetUtilisateurController> _logger;

        public ProjetUtilisateurController(
            IProjetUtilisateurCoreBusiness projetutilisateurCoreBusiness,
            ILogger<ProjetUtilisateurController> logger)
        {
            _projetutilisateurCoreBusiness = projetutilisateurCoreBusiness;
            _logger = logger;
        }

        /// <summary>
        /// Ajouter ProjetUtilisateur.
        /// </summary>
        /// <param name="projetutilisateurCore"></param>
        /// <returns></returns>
        [HttpPost("ajouter")]
        public async Task<ActionResult<bool>> AjouterProjetUtilisateur([FromBody] ProjetUtilisateurCore projetutilisateurCore)
        {
            var resultat = await _projetutilisateurCoreBusiness.AjouterProjetUtilisateurAsync(projetutilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Modifier ProjetUtilisateur.
        /// </summary>
        /// <param name="projetutilisateurCore"></param>
        /// <returns></returns>
        [HttpPut("modifier")]
        public async Task<ActionResult<bool>> ModifierProjetUtilisateur([FromBody] ProjetUtilisateurCore projetutilisateurCore)
        {
            var resultat = await _projetutilisateurCoreBusiness.ModifierProjetUtilisateurAsync(projetutilisateurCore);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer ProjetUtilisateur.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("supprimer/id/{id}")]
        public async Task<ActionResult<bool>> SupprimerProjetUtilisateur([FromRoute] string id)
        {
            var resultat = await _projetutilisateurCoreBusiness.SupprimerProjetUtilisateurAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Supprimer ProjetUtilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("supprimer-par-condition")]
        public async Task<ActionResult<bool>> SupprimerProjetUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            var resultat = await _projetutilisateurCoreBusiness.SupprimerProjetUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Obtenir ProjetUtilisateur.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("obtenir/id/{id}")]
        public async Task<ActionResult<ProjetUtilisateurCore>> ObtenirProjetUtilisateurParId([FromRoute] string id)
        {
            var resultat = await _projetutilisateurCoreBusiness.ObtenirProjetUtilisateurParIdAsync(id);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste ProjetUtilisateur.
        /// </summary>
        /// <returns></returns>
        [HttpGet("liste")]
        [HttpGet("liste-legacy-1")]
        public async Task<ActionResult<List<ProjetUtilisateurCore>>> ListeProjetUtilisateur()
        {
            List<ProjetUtilisateurCore> resultat = await _projetutilisateurCoreBusiness.ListeProjetUtilisateurAsync();
            return Ok(resultat);
        }

        /// <summary>
        /// Liste ProjetUtilisateur par condition.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <returns></returns>
        [HttpPost("liste-par-condition")]
        public async Task<ActionResult<List<ProjetUtilisateurCore>>> ListeProjetUtilisateurParCondition([FromBody] CritereRecherche critereRecherche)
        {
            List<ProjetUtilisateurCore> resultat = await _projetutilisateurCoreBusiness.ListeProjetUtilisateurParConditionAsync(critereRecherche);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste ProjetUtilisateur avec pagination.
        /// </summary>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpGet("liste-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ProjetUtilisateurCore>>> ListeProjetUtilisateurParPage([FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _projetutilisateurCoreBusiness.ListeProjetUtilisateurParPageAsync(pageNumero, pageTaille);
            return Ok(resultat);
        }

        /// <summary>
        /// Liste ProjetUtilisateur par condition avec pagination.
        /// </summary>
        /// <param name="critereRecherche"></param>
        /// <param name="pageNumero">Numéro de la page (commence à 1).</param>
        /// <param name="pageTaille">Nombre d'éléments par page.</param>
        /// <returns></returns>
        [HttpPost("liste-par-condition-par-page/{pageNumero}/{pageTaille}")]
        public async Task<ActionResult<ResultatPage<ProjetUtilisateurCore>>> ListeProjetUtilisateurParConditionParPage([FromBody] CritereRecherche critereRecherche, [FromRoute] int pageNumero, [FromRoute] int pageTaille)
        {
            var resultat = await _projetutilisateurCoreBusiness.ListeProjetUtilisateurParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
            return Ok(resultat);
        }
    }
}

/*
    ============================================================
    INJECTION DE DÉPENDANCES — copier dans Program.cs
    ============================================================
 
    builder.Services.AddScoped<IProjetUtilisateurCoreBusiness, ProjetUtilisateurCoreBusiness>();
    builder.Services.AddScoped<IProjetUtilisateurCoreRepository, ProjetUtilisateurCoreRepository>();
 
*/


