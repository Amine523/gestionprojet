using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/projects/enhanced")]
    public class EnhancedProjectsController : ControllerBase
    {
        private readonly IProjetBusiness _projetBusiness;
        private readonly CalculationService _calculationService;

        public EnhancedProjectsController(IProjetBusiness projetBusiness, CalculationService calculationService)
        {
            _projetBusiness = projetBusiness;
            _calculationService = calculationService;
        }

        [HttpGet("{projectId}/stats")]
        public async Task<IActionResult> GetProjectStats(string projectId)
        {
            try
            {
                var stats = await _calculationService.CalculateProjectStatsAsync(projectId);
                return Ok(stats);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = $"Projet {projectId} non trouvé" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul des statistiques", message = ex.Message });
            }
        }

        [HttpGet("societe/{societeId}/stats")]
        public async Task<IActionResult> GetAllProjectsStats(string societeId)
        {
            try
            {
                var stats = await _calculationService.CalculateAllProjectsStatsAsync(societeId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul des statistiques", message = ex.Message });
            }
        }

        [HttpGet("societe/{societeId}/overview")]
        public async Task<IActionResult> GetSocieteOverview(string societeId)
        {
            try
            {
                var projects = await _projetBusiness.ListeParSocieteAsync(societeId);
                var stats = await _calculationService.CalculateAllProjectsStatsAsync(societeId);

                var overview = new
                {
                    TotalProjects = projects.Count(),
                    ActiveProjects = projects.Count(p => p.Status == "En cours" || p.Status == "In Progress"),
                    CompletedProjects = projects.Count(p => p.Status == "Terminé" || p.Status == "Done"),
                    TotalTaches = stats.Sum(s => s.TotalTaches),
                    TachesDone = stats.Sum(s => s.TachesDone),
                    GlobalProgress = stats.Any() ? stats.Average(s => s.PourcentageAvancement) : 0,
                    OverdueProjects = stats.Count(s => s.EstEnRetard)
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de la récupération de la vue d'ensemble", message = ex.Message });
            }
        }
    }
}
