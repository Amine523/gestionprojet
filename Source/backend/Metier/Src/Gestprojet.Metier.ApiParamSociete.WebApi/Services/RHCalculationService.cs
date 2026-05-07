using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public class CongeInfoModel {
        public string UtilisateurId { get; set; } = "";
        public DateTime DateEmbauche { get; set; }
        public decimal SoldeAjustement { get; set; }
    }
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

        public async Task<decimal> CalculateWorkedHoursAsync(string utilisateurId, DateTime date, DateTime? currentNow = null)
        {
            var pointages = await _pointageBusiness.ListeAsync();
            var userPointages = pointages.Where(p => 
                p.UtilisateurId == utilisateurId && 
                p.Date.HasValue && 
                p.Date.Value.Date == date.Date &&
                p.Actif == true).ToList();

            double totalHours = userPointages.Sum(p => {
                if (p.Duree.HasValue && p.Duree.Value > 0) return p.Duree.Value;
                
                // If currently clocked in (no HeureSortie), calculate duration until now
                if (!string.IsNullOrEmpty(p.HeureEntree) && (string.IsNullOrEmpty(p.HeureSortie) || p.HeureSortie == "00:00:00" || p.HeureSortie == "00:00"))
                {
                    if (TimeSpan.TryParse(p.HeureEntree, out TimeSpan entree))
                    {
                        var now = (currentNow ?? DateTime.Now).TimeOfDay;
                        if (now > entree)
                        {
                            return (now - entree).TotalHours;
                        }
                    }
                }
                return 0;
            });
            return (decimal)totalHours;
        }

        private readonly string _congeInfoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "EmployeCongesInfo.json");

        private List<CongeInfoModel> ReadCongesInfo() {
            if (!File.Exists(_congeInfoPath)) return new List<CongeInfoModel>();
            try {
                var content = File.ReadAllText(_congeInfoPath);
                return JsonSerializer.Deserialize<List<CongeInfoModel>>(content) ?? new List<CongeInfoModel>();
            } catch { return new List<CongeInfoModel>(); }
        }

        private void SaveCongesInfo(List<CongeInfoModel> data) {
            try {
                var content = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_congeInfoPath, content);
            } catch {}
        }

        public CongeInfoModel GetCongeInfoForUser(string uId) {
            var data = ReadCongesInfo();
            var info = data.FirstOrDefault(x => x.UtilisateurId == uId);
            if (info == null) {
                info = new CongeInfoModel { UtilisateurId = uId, DateEmbauche = new DateTime(DateTime.Today.Year, 1, 1), SoldeAjustement = 0 };
            }
            return info;
        }

        public void UpdateCongeInfo(string uId, DateTime? dateEmbauche, decimal? soldeAjustement) {
            var data = ReadCongesInfo();
            var info = data.FirstOrDefault(x => x.UtilisateurId == uId);
            if (info == null) {
                info = new CongeInfoModel { UtilisateurId = uId, DateEmbauche = new DateTime(DateTime.Today.Year, 1, 1), SoldeAjustement = 0 };
                data.Add(info);
            }
            if (dateEmbauche.HasValue) info.DateEmbauche = dateEmbauche.Value;
            if (soldeAjustement.HasValue) info.SoldeAjustement = soldeAjustement.Value;
            SaveCongesInfo(data);
        }

        private decimal CalculateAcquiredLeave(DateTime dateEmbauche) {
            DateTime today = DateTime.Today;
            if (dateEmbauche > today) return 0;
            
            int months = 0;
            DateTime cursor = dateEmbauche;
            
            if (cursor.Day > 15) {
                cursor = new DateTime(cursor.Year, cursor.Month, 1).AddMonths(1);
            } else {
                cursor = new DateTime(cursor.Year, cursor.Month, 1);
            }

            while (cursor <= new DateTime(today.Year, today.Month, 1)) {
                months++;
                cursor = cursor.AddMonths(1);
            }

            return Math.Round((decimal)(months * 1.66), 2);
        }

        public async Task<SoldeCongeDTO> CalculateSoldeCongeAsync(string utilisateurId)
        {
            try {
                var utilisateur = await _utilisateurBusiness.ObtenirAsync(utilisateurId);
                if (utilisateur == null)
                    throw new KeyNotFoundException($"User {utilisateurId} not found");

                var info = GetCongeInfoForUser(utilisateurId);
                decimal soldeAcquis = CalculateAcquiredLeave(info.DateEmbauche);
                decimal soldeTotal = soldeAcquis + info.SoldeAjustement;
                
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
                            var isMaladie = (demande.Motif?.ToLower()?.Contains("maladie") == true || demande.TypePointageId?.ToUpper() == "MALADIE") && demande.AvecCertificat == true;
                            
                            var nombreJours = (demande.DateFin.Value - demande.DateDebut.Value).Days; // Changed to non-inclusive as per user request
                            if (demande.Jours > 0) nombreJours = demande.Jours;

                            switch (demande.Status?.ToLower())
                            {
                                case "validée":
                                case "validee":
                                case "approved":
                                    if (!isMaladie) {
                                        soldeUtilise += nombreJours;
                                    }
                                    congesValides++;
                                    break;
                                case "en attente":
                                case "en_attente":
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
                    UtilisateurId = utilisateur.Id ?? "",
                    UtilisateurNom = utilisateur.Nom ?? "",
                    SoldeTotal = Math.Round(soldeTotal, 2),
                    SoldeUtilise = Math.Round(soldeUtilise, 2),
                    SoldeRestant = Math.Round(soldeRestant, 2),
                    CongesEnAttente = congesEnAttente,
                    CongesValides = congesValides,
                    CongesRefuses = congesRefuses,
                    DateEmbauche = info.DateEmbauche,
                    SoldeAcquis = soldeAcquis,
                    SoldeAjustement = info.SoldeAjustement
                };
            } catch (Exception ex) {
                _logger.LogError(ex, $"Critical error calculating leave balance for {utilisateurId}");
                return new SoldeCongeDTO { 
                    UtilisateurId = utilisateurId, 
                    UtilisateurNom = "Inconnu",
                    SoldeRestant = 0 
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

                var rawPointages = await _pointageBusiness.ListeAsync();
                var pointages = rawPointages ?? new List<Gestprojet.Core.ApiParamSociete.Client.Model.PointageCore>();
                
                var societePointagesToday = pointages.Where(p => 
                    activeUserIds.Contains(p.UtilisateurId) &&
                    p.Date.HasValue &&
                    p.Date.Value.Date == startOfDay &&
                    p.Actif == true).ToList();

                employesPresents = societePointagesToday.Select(p => p.UtilisateurId).Distinct().Count();
                totalHeuresAujourdhui = societePointagesToday.Sum(p => p.Duree ?? 0);

                var demandes = await _demandeCongeBusiness.ListeParSocieteAsync(societeId);
                demandesCongesEnAttente = demandes?.Count(d => 
                    d.Status == "En attente" || 
                    d.Status == "En_attente" || 
                    d.Status?.ToLower() == "pending") ?? 0;
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
                EmployesPresents = employesPresents,
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
                HeureEntree = request.Date.ToString("HH:mm:ss"),
                Actif = true
            };

            return await _pointageBusiness.AjouterOuModifierAsync(pointage);
        }

        public async Task<OperationResult> ClockOutAsync(ClockOutRequest request)
        {
            var today = DateTime.Today;
            var rawPointages = await _pointageBusiness.ListeAsync();
            var pointages = rawPointages ?? new List<Gestprojet.Core.ApiParamSociete.Client.Model.PointageCore>();
            
            _logger.LogInformation($"ClockOutAsync: Request for User:{request.UtilisateurId}, PointageId:{request.PointageId}");
            _logger.LogInformation($"ClockOutAsync: Total pointages count: {pointages.Count()}");
            _logger.LogInformation($"ClockOutAsync: Today's date: {today}");
            
            foreach (var p in pointages.Where(p => p.UtilisateurId == request.UtilisateurId))
            {
                _logger.LogInformation($"ClockOutAsync: Pointage for user - Id:{p.Id}, Date:{p.Date}, HeureEntree:{p.HeureEntree}, HeureSortie:{p.HeureSortie}");
            }
            
            Gestprojet.Core.ApiParamSociete.Client.Model.PointageCore? lastPointage = null;

            if (!string.IsNullOrEmpty(request.PointageId))
            {
                lastPointage = pointages.FirstOrDefault(p => p.Id == request.PointageId);
                _logger.LogInformation($"ClockOutAsync: Search by Id '{request.PointageId}' found: {lastPointage != null}");
            }

            if (lastPointage == null)
            {
                lastPointage = pointages
                    .Where(p => p.UtilisateurId == request.UtilisateurId && 
                                p.Date.HasValue && 
                                p.Date.Value.Date == today && 
                                (string.IsNullOrEmpty(p.HeureSortie) || p.HeureSortie == "00:00:00" || p.HeureSortie == "00:00"))
                    .OrderByDescending(p => p.HeureEntree)
                    .FirstOrDefault();
                _logger.LogInformation($"ClockOutAsync: Search by User/Today found: {lastPointage != null}");
            }

            if (lastPointage == null)
            {
                _logger.LogWarning($"ClockOutAsync: No active pointage found for user {request.UtilisateurId} today.");
                return OperationResult.Fail("Aucun pointage en cours trouvé.");
            }

            _logger.LogInformation($"ClockOutAsync: Closing pointage {lastPointage.Id} for user {request.UtilisateurId}");

            lastPointage.HeureSortie = request.Date.ToString("HH:mm:ss");
            
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

            try 
            {
                return await _pointageBusiness.AjouterOuModifierAsync(lastPointage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"ClockOutAsync: Error saving pointage {lastPointage.Id}");
                throw;
            }
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
                        return (d.DateFin.Value - d.DateDebut.Value).Days;
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

