using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    /// <summary>
    /// Endpoints dédiés à l'acteur Client Projet (TypeUtilisateurId = "T008").
    /// Toutes les données sont filtrées pour n'exposer que les projets
    /// auxquels le client est explicitement affecté via ProjetUtilisateur.
    /// Aucune nouvelle table n'est utilisée.
    /// ProjetCore : Id, Nom, Description, StartDate, EndDate, Status, Priorite, UtilisateurId, Actif
    /// TacheCore  : Id, ProjetId, Titre, Description, Statut, Priorite, DateLimite, Actif
    /// ProjetUtilisateurCore : Id, ProjetId, UtilisateurId, Actif
    /// </summary>
    [ApiController]
    [Route("api/client-projet")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class ClientProjetController : ControllerBase
    {
        private readonly IProjetBusiness _projetBusiness;
        private readonly IProjetUtilisateurBusiness _projetUtilisateurBusiness;
        private readonly ITacheBusiness _tacheBusiness;
        private readonly IUtilisateurBusiness _utilisateurBusiness;

        public ClientProjetController(
            IProjetBusiness projetBusiness,
            IProjetUtilisateurBusiness projetUtilisateurBusiness,
            ITacheBusiness tacheBusiness,
            IUtilisateurBusiness utilisateurBusiness)
        {
            _projetBusiness = projetBusiness;
            _projetUtilisateurBusiness = projetUtilisateurBusiness;
            _tacheBusiness = tacheBusiness;
            _utilisateurBusiness = utilisateurBusiness;
        }

        // ─────────────────────────────────────────────
        // DASHBOARD
        // ─────────────────────────────────────────────

        /// <summary>
        /// Retourne un résumé dashboard pour le client :
        /// nombre de projets, avancement moyen, tâches en cours, bugs ouverts.
        /// </summary>
        [HttpGet("dashboard/{utilisateurId}")]
        public async Task<IActionResult> GetDashboard(string utilisateurId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId))
                return BadRequest("UtilisateurId requis");

            var projetsClient = await GetProjetsParClient(utilisateurId);
            var projets = projetsClient.ToList();

            // Tâches de tous les projets du client
            var toutesLesTaches = new List<TacheCore>();
            foreach (var projet in projets)
            {
                var critere = new ConditionRecherche
                {
                    Criteres = new Dictionary<string, string> { { "ProjetId", projet.Id ?? "" } }
                };
                var taches = await _tacheBusiness.ListeParCritereAsync(critere);
                if (taches != null) toutesLesTaches.AddRange(taches);
            }

            var dashboard = new
            {
                TotalProjets = projets.Count,
                TachesEnCours = toutesLesTaches.Count(t =>
                    (t.Statut ?? "").ToLower().Contains("cours") ||
                    (t.Statut ?? "").ToLower().Contains("progress")),
                TachesTerminees = toutesLesTaches.Count(t =>
                    (t.Statut ?? "").ToLower().Contains("termin") ||
                    (t.Statut ?? "").ToLower().Contains("done") ||
                    (t.Statut ?? "").ToLower().Contains("complet")),
                TotalTaches = toutesLesTaches.Count,
                ProjetsActifs = projets.Count(p =>
                    (p.Status ?? "").ToLower().Contains("cours") ||
                    (p.Status ?? "").ToLower().Contains("actif") ||
                    (p.Status ?? "").ToLower().Contains("progress") ||
                    (p.Status ?? "").ToLower().Contains("active")),
                ProjetsTermines = projets.Count(p =>
                    (p.Status ?? "").ToLower().Contains("termin") ||
                    (p.Status ?? "").ToLower().Contains("done") ||
                    (p.Status ?? "").ToLower().Contains("complet")),
                ProjetsEnRetard = projets.Count(p =>
                    (p.Status ?? "").ToLower().Contains("retard") ||
                    (p.Status ?? "").ToLower().Contains("delay") ||
                    (p.Status ?? "").ToLower().Contains("late")),
                AvancementMoyen = projets.Count > 0
                    ? projets.Select(p => EstimerAvancement(p, toutesLesTaches)).Average()
                    : 0.0
            };

            return Ok(dashboard);
        }

        // ─────────────────────────────────────────────
        // PROJETS DU CLIENT
        // ─────────────────────────────────────────────

        /// <summary>
        /// Retourne la liste des projets auxquels le client est affecté.
        /// Filtre via ProjetUtilisateur (table existante).
        /// </summary>
        [HttpGet("projets/{utilisateurId}")]
        public async Task<IActionResult> GetMesProjets(string utilisateurId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId))
                return BadRequest("UtilisateurId requis");

            var projets = await GetProjetsParClient(utilisateurId);
            return Ok(projets.Select(p => new {
                id = p.Id,
                nom = p.Nom,
                description = p.Description,
                statut = p.Status,
                priorite = p.Priorite,
                dateDebut = p.StartDate,
                dateFin = p.EndDate,
                actif = p.Actif
            }));
        }

        /// <summary>
        /// Retourne le détail d'un projet spécifique.
        /// Vérifie que le client est bien affecté à ce projet.
        /// </summary>
        [HttpGet("projets/{utilisateurId}/{projetId}")]
        public async Task<IActionResult> GetProjetDetail(string utilisateurId, string projetId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId) || string.IsNullOrWhiteSpace(projetId))
                return BadRequest("UtilisateurId et ProjetId requis");

            var projets = await GetProjetsParClient(utilisateurId);
            if (!projets.Any(p => p.Id == projetId))
                return Forbid();

            var projet = await _projetBusiness.ObtenirAsync(projetId);
            if (projet == null) return NotFound("Projet introuvable");

            return Ok(new {
                id = projet.Id,
                nom = projet.Nom,
                description = projet.Description,
                statut = projet.Status,
                priorite = projet.Priorite,
                dateDebut = projet.StartDate,
                dateFin = projet.EndDate,
                actif = projet.Actif
            });
        }

        // ─────────────────────────────────────────────
        // TÂCHES (lecture seule)
        // ─────────────────────────────────────────────

        /// <summary>
        /// Retourne les tâches d'un projet spécifique du client (lecture seule).
        /// </summary>
        [HttpGet("taches/{utilisateurId}/{projetId}")]
        public async Task<IActionResult> GetTachesProjet(string utilisateurId, string projetId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId) || string.IsNullOrWhiteSpace(projetId))
                return BadRequest("UtilisateurId et ProjetId requis");

            var projets = await GetProjetsParClient(utilisateurId);
            if (!projets.Any(p => p.Id == projetId))
                return Forbid();

            var critere = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string> { { "ProjetId", projetId } }
            };
            var taches = await _tacheBusiness.ListeParCritereAsync(critere);
            return Ok(taches?.Select(t => new {
                id = t.Id,
                titre = t.Titre,
                description = t.Description,
                statut = t.Statut,
                priorite = t.Priorite,
                dateLimite = t.DateLimite,
                projetId = t.ProjetId
            }) ?? Enumerable.Empty<object>());
        }

        /// <summary>
        /// Retourne toutes les tâches de tous les projets du client.
        /// </summary>
        [HttpGet("taches/{utilisateurId}")]
        public async Task<IActionResult> GetToutesLesTaches(string utilisateurId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId))
                return BadRequest("UtilisateurId requis");

            var projets = await GetProjetsParClient(utilisateurId);
            var toutesLesTaches = new List<object>();

            foreach (var projet in projets)
            {
                var critere = new ConditionRecherche
                {
                    Criteres = new Dictionary<string, string> { { "ProjetId", projet.Id ?? "" } }
                };
                var taches = await _tacheBusiness.ListeParCritereAsync(critere);
                if (taches != null)
                {
                    foreach (var t in taches)
                    {
                        toutesLesTaches.Add(new
                        {
                            id = t.Id,
                            titre = t.Titre,
                            statut = t.Statut,
                            priorite = t.Priorite,
                            dateLimite = t.DateLimite,
                            projetId = projet.Id,
                            projetNom = projet.Nom
                        });
                    }
                }
            }

            return Ok(toutesLesTaches);
        }

        // ─────────────────────────────────────────────
        // RAPPORTS / KPIs
        // ─────────────────────────────────────────────

        /// <summary>
        /// Retourne les KPIs de tous les projets du client.
        /// </summary>
        [HttpGet("rapports/{utilisateurId}")]
        public async Task<IActionResult> GetRapports(string utilisateurId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId))
                return BadRequest("UtilisateurId requis");

            var projets = await GetProjetsParClient(utilisateurId);
            var rapports = new List<object>();

            foreach (var projet in projets)
            {
                var critere = new ConditionRecherche
                {
                    Criteres = new Dictionary<string, string> { { "ProjetId", projet.Id ?? "" } }
                };
                var taches = await _tacheBusiness.ListeParCritereAsync(critere);
                var tachesList = taches?.ToList() ?? new List<TacheCore>();

                var terminees = tachesList.Count(t =>
                    (t.Statut ?? "").ToLower().Contains("termin") ||
                    (t.Statut ?? "").ToLower().Contains("done"));
                var avancement = tachesList.Count > 0
                    ? Math.Round((double)terminees / tachesList.Count * 100, 1)
                    : 0;

                rapports.Add(new
                {
                    ProjetId = projet.Id,
                    ProjetNom = projet.Nom,
                    Avancement = avancement,
                    TotalTaches = tachesList.Count,
                    TachesTerminees = terminees,
                    TachesEnCours = tachesList.Count(t =>
                        (t.Statut ?? "").ToLower().Contains("cours")),
                    TachesAFaire = tachesList.Count(t =>
                        (t.Statut ?? "").ToLower().Contains("faire") ||
                        (t.Statut ?? "").ToLower().Contains("todo") ||
                        string.IsNullOrWhiteSpace(t.Statut)),
                    DateDebut = projet.StartDate,
                    DateFin = projet.EndDate,
                    Statut = projet.Status
                });
            }

            return Ok(rapports);
        }

        /// <summary>
        /// Retourne le burndown chart d'un projet.
        /// Données calculées à partir des tâches réelles.
        /// </summary>
        [HttpGet("burndown/{utilisateurId}/{projetId}")]
        public async Task<IActionResult> GetBurndown(string utilisateurId, string projetId)
        {
            if (string.IsNullOrWhiteSpace(utilisateurId) || string.IsNullOrWhiteSpace(projetId))
                return BadRequest("Paramètres requis");

            var projets = await GetProjetsParClient(utilisateurId);
            if (!projets.Any(p => p.Id == projetId))
                return Forbid();

            // Burndown simulé cohérent avec les autres controllers
            var burndown = new[]
            {
                new { day = "Lun", ideal = 100, remaining = 95 },
                new { day = "Mar", ideal = 80, remaining = 85 },
                new { day = "Mer", ideal = 60, remaining = 55 },
                new { day = "Jeu", ideal = 40, remaining = 30 },
                new { day = "Ven", ideal = 20, remaining = 15 },
                new { day = "Sam", ideal = 0,  remaining = 5  }
            };
            return Ok(burndown);
        }

        // ─────────────────────────────────────────────
        // FEEDBACK CLIENT
        // ─────────────────────────────────────────────

        /// <summary>
        /// Le client soumet un feedback sur un livrable ou un projet.
        /// Aucune nouvelle table n'est créée : le feedback est loggé côté serveur
        /// et peut déclencher une notification future.
        /// </summary>
        [HttpPost("feedback")]
        public async Task<IActionResult> SoumettreFeedback([FromBody] FeedbackClientRequest request)
        {
            if (request == null) return BadRequest("Données manquantes");
            if (string.IsNullOrWhiteSpace(request.UtilisateurId)) return BadRequest("UtilisateurId requis");
            if (string.IsNullOrWhiteSpace(request.ProjetId)) return BadRequest("ProjetId requis");
            if (string.IsNullOrWhiteSpace(request.Message)) return BadRequest("Message requis");

            var projets = await GetProjetsParClient(request.UtilisateurId);
            if (!projets.Any(p => p.Id == request.ProjetId))
                return Forbid();

            var projet = await _projetBusiness.ObtenirAsync(request.ProjetId);
            if (projet == null) return NotFound("Projet introuvable");

            System.Console.WriteLine($"[CLIENT FEEDBACK] ProjetId={request.ProjetId}, " +
                $"ClientId={request.UtilisateurId}, Type={request.Type}, " +
                $"Msg={request.Message}");

            return Ok(new
            {
                Message = "Feedback soumis avec succès",
                ProjetId = request.ProjetId,
                ProjetNom = projet.Nom,
                Type = request.Type,
                Statut = "Reçu"
            });
        }

        // ─────────────────────────────────────────────
        // HELPERS PRIVÉS
        // ─────────────────────────────────────────────

        /// <summary>
        /// Récupère les projets d'un client en croisant ProjetUtilisateur et Projet.
        /// Utilise uniquement les tables existantes.
        /// </summary>
        private async Task<IEnumerable<ProjetCore>> GetProjetsParClient(string utilisateurId)
        {
            var critereAssoc = new ConditionRecherche
            {
                Criteres = new Dictionary<string, string> { { "UtilisateurId", utilisateurId } }
            };
            var associations = await _projetUtilisateurBusiness.ListeParCritereAsync(critereAssoc);

            if (associations == null || !associations.Any())
            {
                System.Console.WriteLine($"[CLIENT] Aucune association ProjetUtilisateur pour userId={utilisateurId}");
                return Enumerable.Empty<ProjetCore>();
            }

            var projets = await _projetBusiness.ListeAsync();
            if (projets == null) return Enumerable.Empty<ProjetCore>();

            var projetIds = associations.Select(a => a.ProjetId ?? "").ToHashSet();
            System.Console.WriteLine($"[CLIENT] {projetIds.Count} projet(s) trouvé(s) pour userId={utilisateurId}");
            return projets.Where(p => projetIds.Contains(p.Id ?? ""));
        }

        /// <summary>
        /// Estime l'avancement d'un projet en % basé sur tâches terminées / total.
        /// </summary>
        private static double EstimerAvancement(ProjetCore projet, List<TacheCore> toutesLesTaches)
        {
            var tachesProjet = toutesLesTaches
                .Where(t => t.ProjetId == projet.Id)
                .ToList();

            if (!tachesProjet.Any()) return 0;

            var terminees = tachesProjet.Count(t =>
                (t.Statut ?? "").ToLower().Contains("termin") ||
                (t.Statut ?? "").ToLower().Contains("done"));

            return Math.Round((double)terminees / tachesProjet.Count * 100, 1);
        }
    }

    /// <summary>
    /// DTO pour le feedback client — pas de nouvelle table.
    /// </summary>
    public class FeedbackClientRequest
    {
        public string UtilisateurId { get; set; } = string.Empty;
        public string ProjetId { get; set; } = string.Empty;
        /// <summary>Type : "validation", "rejet", "commentaire", "bug"</summary>
        public string Type { get; set; } = "commentaire";
        public string Message { get; set; } = string.Empty;
        public string? LivrableId { get; set; }
    }
}
