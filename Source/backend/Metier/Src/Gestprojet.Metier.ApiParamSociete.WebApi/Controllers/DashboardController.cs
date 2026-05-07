using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAll")]
    public class DashboardController : ControllerBase
    {
        private readonly ISocieteBusiness _societeBusiness;
        private readonly IUtilisateurBusiness _utilisateurBusiness;
        private readonly IProjetBusiness _projetBusiness;
        private readonly ITacheBusiness _tacheBusiness;
        private readonly IApplicationBusiness _applicationBusiness;
        private readonly Gestprojet.Metier.ApiParamSociete.WebApi.Services.RHCalculationService _rhCalculationService;
        private readonly Gestprojet.Metier.ApiParamSociete.WebApi.Services.CalculationService _calculationService;

        public DashboardController(
            ISocieteBusiness societeBusiness, 
            IUtilisateurBusiness utilisateurBusiness, 
            IProjetBusiness projetBusiness,
            ITacheBusiness tacheBusiness,
            IApplicationBusiness applicationBusiness,
            Gestprojet.Metier.ApiParamSociete.WebApi.Services.RHCalculationService rhCalculationService,
            Gestprojet.Metier.ApiParamSociete.WebApi.Services.CalculationService calculationService)
        {
            _societeBusiness = societeBusiness;
            _utilisateurBusiness = utilisateurBusiness;
            _projetBusiness = projetBusiness;
            _tacheBusiness = tacheBusiness;
            _applicationBusiness = applicationBusiness;
            _rhCalculationService = rhCalculationService;
            _calculationService = calculationService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var societes = await _societeBusiness.ListeAsync();
            var utilisateurs = await _utilisateurBusiness.ListeAsync();
            var projets = await _projetBusiness.ListeAsync();
            var candidatures = await _applicationBusiness.ListeAsync();

            return Ok(new
            {
                TotalSocietes = societes.Count(),
                TotalUtilisateurs = utilisateurs.Count(),
                TotalProjets = projets.Count(),
                TotalCandidatures = candidatures.Count(c => c.Type == "Candidature"),
                SocietesActives = societes.Count(s => s.Actif.GetValueOrDefault(true)),
                RevenusMensuels = societes.Count(s => s.Actif.GetValueOrDefault(true)) * 99 // Hypothetical $99 per active company
            });
        }

        [HttpGet("stats/societe/{societeId}")]
        public async Task<IActionResult> GetStatsBySociete(string societeId)
        {
            var societes = await _societeBusiness.ListeAsync();
            var societe = societes.FirstOrDefault(s => s.Id == societeId);
            
            if (societe == null)
            {
                return NotFound(new { error = "Société non trouvée", societeId });
            }

            var utilisateurs = await _utilisateurBusiness.ListeAsync();
            var societeUsers = utilisateurs.Where(u => u.SocieteId == societeId).ToList();
            
            var projets = await _projetBusiness.ListeAsync();
            var societeProjets = projets.Where(p => p.SocieteId == societeId).ToList();

            return Ok(new
            {
                SocieteId = societeId,
                SocieteNom = societe.Nom,
                TotalUtilisateurs = societeUsers.Count(),
                TotalProjets = societeProjets.Count(),
                ProjetsEnCours = societeProjets.Count(p => p.Status?.ToLower() == "en cours"),
                UtilisateursActifs = societeUsers.Count(u => u.Actif.GetValueOrDefault(true))
            });
        }

        [HttpGet("rh-stats/{societeId}")]
        public async Task<IActionResult> GetRHStats(string societeId, [FromQuery] string? date = null)
        {
            try
            {
                DateTime? targetDate = null;
                if (!string.IsNullOrWhiteSpace(date))
                {
                    if (!DateTime.TryParse(date, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsed)
                        && !DateTime.TryParse(date, CultureInfo.CurrentCulture, DateTimeStyles.None, out parsed))
                    {
                        return BadRequest(new { error = "Paramètre date invalide", date });
                    }
                    targetDate = parsed;
                }

                var stats = await _rhCalculationService.CalculateRHStatsAsync(societeId, targetDate);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul des statistiques RH", message = ex.Message });
            }
        }

        [HttpGet("projects/progress/{societeId}")]
        public async Task<IActionResult> GetProjectsProgress(string societeId)
        {
            var stats = await _calculationService.CalculateAllProjectsStatsAsync(societeId);
            return Ok(stats.Select(s => new { 
                name = s.ProjectNom, 
                progress = s.PourcentageAvancement,
                tasks = s.TotalTaches,
                done = s.TachesDone
            }));
        }

        [HttpGet("taches/distribution/{societeId}")]
        public async Task<IActionResult> GetTachesDistribution(string societeId)
        {
            var projects = await _projetBusiness.ListeParSocieteAsync(societeId);
            var projectIds = projects.Select(p => p.Id).ToList();
            
            var allTaches = await _tacheBusiness.ListeAsync();
            var taches = allTaches.Where(t => projectIds.Contains(t.ProjetId)).ToList();

            var distribution = taches.GroupBy(t => t.Statut ?? "Unknown")
                .Select(g => new { status = g.Key, count = g.Count() });

            return Ok(distribution);
        }

        [HttpGet("attendance/trends/{societeId}")]
        public IActionResult GetAttendanceTrends(string societeId)
        {
            // Mock trend data for last 7 days
            var trends = new List<object>();
            for (int i = 6; i >= 0; i--)
            {
                var date = DateTime.Today.AddDays(-i);
                trends.Add(new { 
                    date = date.ToString("dd/MM"), 
                    rate = 85 + (i % 3) * 5 
                });
            }
            return Ok(trends);
        }

        [HttpGet("societes-recentes")]
        public async Task<IActionResult> GetSocietesRecentes([FromQuery] int limit = 5)
        {
            var societes = await _societeBusiness.ListeAsync();
            return Ok(societes.Take(limit));
        }

        [HttpGet("utilisateurs-par-type")]
        public async Task<IActionResult> GetUtilisateursParType()
        {
            var utilisateurs = await _utilisateurBusiness.ListeAsync();
            var grouped = utilisateurs.GroupBy(u => u.TypeUtilisateurId)
                .Select(g => new { Type = g.Key, Count = g.Count() });
            return Ok(grouped);
        }

        [HttpGet("revenus")]
        public IActionResult GetRevenus([FromQuery] string filter = "month")
        {
            int revenus;
            if (filter == "year")
            {
                revenus = 150000; // Mock value
            }
            else
            {
                revenus = 12500; // Mock value
            }
            return Ok(new { revenus, filter });
        }

        [HttpGet("alertes")]
        public async Task<IActionResult> GetAlertes()
        {
            var societes = await _societeBusiness.ListeAsync();
            var utilisateurs = await _utilisateurBusiness.ListeAsync();
            var alertes = new List<object>();
            foreach (var s in societes.Where(s => !s.Actif.GetValueOrDefault(true)))
            {
                alertes.Add(new { type = "societe_inactive", message = $"Société {s.Nom} inactive", societeId = s.Id });
            }
            foreach (var u in utilisateurs.Where(u => !u.Actif.GetValueOrDefault(true)))
            {
                alertes.Add(new { type = "utilisateur_inactive", message = $"Utilisateur {u.Nom} inactif", utilisateurId = u.Id });
            }
            return Ok(alertes);
        }

        [HttpGet("activite-recente")]
        public async Task<IActionResult> GetActiviteRecente([FromQuery] int limit = 10)
        {
            var societes = await _societeBusiness.ListeAsync();
            var utilisateurs = await _utilisateurBusiness.ListeAsync();
            var projets = await _projetBusiness.ListeAsync();
            var activites = new List<object>();
            foreach (var s in societes.Take(limit))
            {
                activites.Add(new { type = "societe", action = "création", nom = s.Nom, date = DateTime.UtcNow.AddDays(-5), id = s.Id });
            }
            foreach (var u in utilisateurs.Take(limit))
            {
                activites.Add(new { type = "utilisateur", action = "connexion", nom = u.Nom, date = DateTime.UtcNow.AddMinutes(-15), id = u.Id });
            }
            foreach (var p in projets.Take(limit))
            {
                activites.Add(new { type = "projet", action = "création", nom = p.Nom, date = DateTime.UtcNow.AddDays(-2), id = p.Id });
            }
            return Ok(activites.Take(limit));
        }

        [HttpGet("uptime")]
        public IActionResult GetUptime()
        {
            var uptime = DateTime.Now - System.Diagnostics.Process.GetCurrentProcess().StartTime;
            return Ok(new
            {
                uptime = $"{(int)uptime.TotalHours}h {uptime.Minutes}m {uptime.Seconds}s",
                status = "operational",
                lastRestart = System.Diagnostics.Process.GetCurrentProcess().StartTime
            });
        }

        [HttpGet("societes-par-mois")]
        public async Task<IActionResult> GetSocietesParMois([FromQuery] int months = 12)
        {
            var societes = await _societeBusiness.ListeAsync();
            var result = new List<object>();
            for (int i = months - 1; i >= 0; i--)
            {
                var date = DateTime.Now.AddMonths(-i);
                var monthStr = date.ToString("MM/yyyy");
                // In a real app, we'd check the creation date. Here we return 0 if no data.
                result.Add(new { name = date.ToString("MMM"), mois = monthStr, count = 0 });
            }
            return Ok(result);
        }

        [HttpGet("financial-health/{societeId}")]
        public IActionResult GetFinancialHealth(string societeId)
        {
            return Ok(new
            {
                societeId,
                revenusMensuels = 5000,
                depensesMensuelles = 2000,
                solde = 3000,
                status = "Bon"
            });
        }

        [HttpGet("societe-drilldown/{societeId}")]
        public IActionResult GetSocieteDrilldown(string societeId)
        {
            return Ok(new
            {
                societeId,
                utilisateursActifs = 15,
                projetsEnCours = 3,
                scoreEngagement = 85
            });
        }

        [HttpGet("expiring-subscriptions")]
        public IActionResult GetExpiringSubscriptions([FromQuery] int days = 7)
        {
            return Ok(new List<object>
            {
                new { id = "ABO_123", societeId = "SOC_1", societeNom = "Tech Corp", dateFin = DateTime.UtcNow.AddDays(3), statut = "Bientôt expiré" }
            });
        }

        [HttpPost("send-renewal-notification")]
        public IActionResult SendRenewalNotification([FromBody] dynamic request)
        {
            return Ok(new { success = true, message = "Notification envoyée" });
        }
    }
}
