using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Application;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Diagnostics;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemandesCongeController : ControllerBase
    {
        private readonly IDemandeCongeCoreBusiness _business;

        public DemandesCongeController(IDemandeCongeCoreBusiness business)
        {
            _business = business;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _business.ListeDemandeCongeAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR GetAll: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _business.ObtenirDemandeCongeParIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR GetById: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySociete(string societeId)
        {
            try
            {
                Debug.WriteLine($"GetBySociete called with: {societeId}");
                var result = await _business.ListeDemandeCongeParSocieteAsync(societeId);
                Debug.WriteLine($"Result: {result?.Count} items");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR GetBySociete: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message, details = ex.StackTrace });
            }
        }

        [HttpGet("utilisateur/{utilisateurId}")]
        public async Task<IActionResult> GetByUtilisateur(string utilisateurId)
        {
            try
            {
                var result = await _business.ListeDemandeCongeParUtilisateurAsync(utilisateurId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR GetByUtilisateur: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("solde/{utilisateurId}")]
        public IActionResult GetSolde(string utilisateurId)
        {
            // Calculate or return mock solde
            // By default let's return 21 days
            return Ok(new { joursRestants = 21, joursPris = 0, total = 21 });
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] DemandeCongeCore entity)
        {
            try
            {
                var result = await _business.AjouterDemandeCongeAsync(entity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR Add: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] DemandeCongeCore entity)
        {
            try
            {
                var result = await _business.ModifierDemandeCongeAsync(entity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR Update: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _business.SupprimerDemandeCongeAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR Delete: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class JoursFeriesController : ControllerBase
    {
        private readonly IJourFerieCoreBusiness _business;

        public JoursFeriesController(IJourFerieCoreBusiness business)
        {
            _business = business;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _business.ListeJourFerieAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ERROR JoursFeries GetAll: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var result = await _business.ObtenirJourFerieParIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySociete(string societeId)
        {
            try
            {
                var result = await _business.ListeJourFerieParSocieteAsync(societeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] JourFerieCore entity)
        {
            try
            {
                var result = await _business.AjouterJourFerieAsync(entity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] JourFerieCore entity)
        {
            try
            {
                var result = await _business.ModifierJourFerieAsync(entity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _business.SupprimerJourFerieAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
