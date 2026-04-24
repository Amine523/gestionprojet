using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public class RHCalculationService
    {
        private readonly IPointageBusiness _pointageBusiness;
        private readonly IDemandeCongeBusiness _demandeCongeBusiness;
        private readonly IUtilisateurBusiness _utilisateurBusiness;
        private readonly ILogger<RHCalculationService> _logger;

        public RHCalculationService(
            IPointageBusiness pointageBusiness,
            IDemandeCongeBusiness demandeCongeBusiness,
            IUtilisateurBusiness utilisateurBusiness,
            ILogger<RHCalculationService> logger)
        {
            _pointageBusiness = pointageBusiness;
            _demandeCongeBusiness = demandeCongeBusiness;
            _utilisateurBusiness = utilisateurBusiness;
            _logger = logger;
        }

        public async Task<decimal> CalculateWorkedHoursAsync(string utilisateurId, DateTime date)
        {
            var pointages = await _pointageBusiness.ListeAsync();
            var userPointages = pointages.Where(p => 
                p.UtilisateurId == utilisateurId && 
                p.Date.HasValue && 
                p.Date.Value.Date == date.Date &&
                p.Actif == true).ToList();

            double totalHours = userPointages.Sum(p => p.Duree ?? 0);
            return (decimal)totalHours;
        }

        public async Task<SoldeCongeDTO> CalculateSoldeCongeAsync(string utilisateurId)
        {
            try {
                var utilisateur = await _utilisateurBusiness.ObtenirAsync(utilisateurId);
                if (utilisateur == null)
                    throw new KeyNotFoundException($"User {utilisateurId} not found");

                decimal soldeTotal = 30; // Default annual leave balance
                
                IEnumerable<DemandeCongeCore> demandes = new List<DemandeCongeCore>();
                try {
                    demandes = await _demandeCongeBusiness.ListeParUtilisateurAsync(utilisateurId);
                } catch (Exception ex) {
                    _logger.LogWarning($"Could not fetch leave requests for user {utilisateurId}: {ex.Message}");
                }

                decimal soldeUtilise = 0;
                int congesEnAttente = 0;
                int congesValides = 0;
                int congesRefuses = 0;

                if (demandes != null) {
                    foreach (var demande in demandes)
                    {
                        if (demande.DateDebut.HasValue && demande.DateFin.HasValue)
                        {
                            var nombreJours = (demande.DateFin.Value - demande.DateDebut.Value).Days + 1;

                            switch (demande.Status?.ToLower())
                            {
                                case "validée":
                                case "validee":
                                case "approved":
                                    soldeUtilise += nombreJours;
                                    congesValides++;
                                    break;
                                case "en attente":
                                case "pending":
                                    congesEnAttente++;
                                    break;
                                case "refusée":
                                case "refusee":
                                case "rejected":
                                    congesRefuses++;
                                    break;
                            }
                        }
                    }
                }

                var soldeRestant = soldeTotal - soldeUtilise;

                return new SoldeCongeDTO
                {
                    UtilisateurId = utilisateur.Id,
                    UtilisateurNom = utilisateur.Nom,
                    SoldeTotal = soldeTotal,
                    SoldeUtilise = soldeUtilise,
                    SoldeRestant = soldeRestant,
                    CongesEnAttente = congesEnAttente,
                    CongesValides = congesValides,
                    CongesRefuses = congesRefuses
                };
            } catch (Exception ex) {
                _logger.LogError(ex, $"Critical error calculating leave balance for {utilisateurId}");
                return new SoldeCongeDTO { 
                    UtilisateurId = utilisateurId, 
                    UtilisateurNom = "Inconnu",
                    SoldeRestant = 30 
                };
            }
        }

        public async Task<RHStatsDTO> CalculateRHStatsAsync(string societeId, DateTime? date = null)
        {
            var targetDate = date ?? DateTime.Today;
            var startOfDay = targetDate.Date;
            var startOfMonth = new DateTime(targetDate.Year, targetDate.Month, 1);

            int totalEmployes = 0;
            int employesActifs = 0;
            int employesPresents = 0;
            double totalHeuresAujourdhui = 0;
            int demandesCongesEnAttente = 0;
            int congesValidesCeMois = 0;

            try
            {
                var allUsers = await _utilisateurBusiness.ListeAsync();
                var utilisateurs = allUsers.Where(u => u.SocieteId == societeId).ToList();
                
                totalEmployes = utilisateurs.Count;
                employesActifs = utilisateurs.Count(u => u.Actif == true);
                var activeUserIds = utilisateurs.Where(u => u.Actif == true).Select(u => u.Id).ToList();

                var pointages = await _pointageBusiness.ListeAsync();
                var societePointagesToday = pointages.Where(p => 
                    activeUserIds.Contains(p.UtilisateurId) &&
                    p.Date.HasValue &&
                    p.Date.Value.Date == startOfDay &&
                    p.Actif == true).ToList();

                employesPresents = societePointagesToday.Select(p => p.UtilisateurId).Distinct().Count();
                totalHeuresAujourdhui = societePointagesToday.Sum(p => p.Duree ?? 0);

                var demandes = await _demandeCongeBusiness.ListeParSocieteAsync(societeId);
                demandesCongesEnAttente = demandes?.Count(d => d.Status == "En attente") ?? 0;
                congesValidesCeMois = demandes?.Count(d => 
                    d.Status == "Validée" && 
                    d.DateDebut.HasValue && 
                    d.DateDebut.Value >= startOfMonth) ?? 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating RH stats");
            }

            var employesAbsents = employesActifs - employesPresents;
            var tauxPresence = employesActifs > 0 ? (decimal)employesPresents / employesActifs * 100 : 0;

            return new RHStatsDTO
            {
                TotalEmployes = totalEmployes,
                EmployesActifs = employesActifs,
                EmployesAbsents = employesAbsents,
                TotalHeuresAujourdhui = (decimal)Math.Round(totalHeuresAujourdhui, 2),
                DemandesCongesEnAttente = demandesCongesEnAttente,
                CongesValidesCeMois = congesValidesCeMois,
                TauxPresence = Math.Round(tauxPresence, 2)
            };
        }

        public async Task<IEnumerable<SoldeCongeDTO>> GetSoldesCongesAsync(string societeId)
        {
            var users = await _utilisateurBusiness.ListeAsync();
            var societeUsers = users.Where(u => u.SocieteId == societeId).ToList();
            
            var result = new List<SoldeCongeDTO>();
            foreach (var user in societeUsers)
            {
                try
                {
                    result.Add(await CalculateSoldeCongeAsync(user.Id));
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Could not calculate leave balance for user {user.Id}: {ex.Message}");
                }
            }
            return result;
        }

        public async Task<OperationResult> ClockInAsync(ClockInRequest request)
        {
            var pointage = new Gestprojet.Core.ApiParamSociete.Client.Model.PointageCore
            {
                UtilisateurId = request.UtilisateurId,
                Date = request.Date.Date,
                TypeId = request.TypeId,
                HeureEntree = request.Date.ToString("HH:mm"),
                Actif = true
            };

            return await _pointageBusiness.AjouterOuModifierAsync(pointage);
        }

        public async Task<OperationResult> ClockOutAsync(ClockOutRequest request)
        {
            var today = DateTime.Today;
            var pointages = await _pointageBusiness.ListeAsync();
            var lastPointage = pointages
                .Where(p => p.UtilisateurId == request.UtilisateurId && p.Date.HasValue && p.Date.Value.Date == today && string.IsNullOrEmpty(p.HeureSortie))
                .OrderByDescending(p => p.HeureEntree)
                .FirstOrDefault();

            if (lastPointage == null)
                return OperationResult.Fail("Aucun pointage en cours trouvé pour aujourd'hui.");

            lastPointage.HeureSortie = DateTime.Now.ToString("HH:mm");
            
            // Calculate duration if possible
            if (!string.IsNullOrEmpty(lastPointage.HeureEntree) && !string.IsNullOrEmpty(lastPointage.HeureSortie))
            {
                if (TimeSpan.TryParse(lastPointage.HeureEntree, out TimeSpan entree) && 
                    TimeSpan.TryParse(lastPointage.HeureSortie, out TimeSpan sortie))
                {
                    var duration = sortie - entree;
                    lastPointage.Duree = duration.TotalHours;
                }
            }

            return await _pointageBusiness.AjouterOuModifierAsync(lastPointage);
        }

        public async Task<OperationResult> CreateDemandeCongeAsync(Gestprojet.Core.ApiParamSociete.Client.Model.DemandeCongeCore dto)
        {
            return await _demandeCongeBusiness.AjouterOuModifierAsync(dto);
        }

        public async Task<IEnumerable<RapportPresenceDTO>> CalculateRapportPresenceAsync(string societeId, int mois, int annee)
        {
            var allUsers = await _utilisateurBusiness.ListeAsync();
            var employes = allUsers.Where(u => u.SocieteId == societeId && u.Actif == true).ToList();

            var allPointages = await _pointageBusiness.ListeAsync();
            var periodPointages = allPointages.Where(p =>
                p.Date.HasValue &&
                p.Date.Value.Month == mois &&
                p.Date.Value.Year == annee &&
                p.Actif == true).ToList();

            var allDemandes = await _demandeCongeBusiness.ListeParSocieteAsync(societeId);
            var periodDemandes = allDemandes.Where(d =>
                d.DateDebut.HasValue &&
                ((d.DateDebut.Value.Month == mois && d.DateDebut.Value.Year == annee) ||
                 (d.DateFin.HasValue && d.DateFin.Value.Month == mois && d.DateFin.Value.Year == annee)) &&
                (d.Status == "Validée" || d.Status == "Validee" || d.Status == "approved")).ToList();

            int joursOuvrables = CalculerJoursOuvrables(annee, mois);

            var result = new List<RapportPresenceDTO>();
            foreach (var emp in employes)
            {
                var empPointages = periodPointages.Where(p => p.UtilisateurId == emp.Id).ToList();
                int joursTravailles = empPointages.Select(p => p.Date?.Date).Distinct().Count();
                decimal heuresTotales = (decimal)empPointages.Sum(p => p.Duree ?? 0);

                var empDemandes = periodDemandes.Where(d => d.UtilisateurId == emp.Id).ToList();
                int joursConge = empDemandes.Sum(d =>
                {
                    if (d.DateDebut.HasValue && d.DateFin.HasValue)
                        return (d.DateFin.Value - d.DateDebut.Value).Days + 1;
                    return 0;
                });

                int joursAbsent = Math.Max(0, joursOuvrables - joursTravailles - joursConge);
                decimal tauxPresence = joursOuvrables > 0
                    ? Math.Round((decimal)(joursTravailles + joursConge) / joursOuvrables * 100, 2)
                    : 0;

                result.Add(new RapportPresenceDTO
                {
                    UtilisateurId = emp.Id ?? "",
                    NomComplet = emp.Nom ?? "",
                    JoursTravailles = joursTravailles,
                    HeuresTotales = Math.Round(heuresTotales, 2),
                    JoursConge = joursConge,
                    JoursAbsent = joursAbsent,
                    TauxPresence = tauxPresence
                });
            }

            return result;
        }

        private static int CalculerJoursOuvrables(int annee, int mois)
        {
            int count = 0;
            int daysInMonth = DateTime.DaysInMonth(annee, mois);
            for (int d = 1; d <= daysInMonth; d++)
            {
                var day = new DateTime(annee, mois, d).DayOfWeek;
                if (day != DayOfWeek.Saturday && day != DayOfWeek.Sunday)
                    count++;
            }
            return count;
        }
    }
}

