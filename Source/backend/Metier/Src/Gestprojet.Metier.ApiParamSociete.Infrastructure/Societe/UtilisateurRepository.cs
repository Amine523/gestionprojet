using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Commun;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe
{
    public class UtilisateurRepository : IUtilisateurRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<UtilisateurRepository> _logger;
        private readonly IUtilisateurApi _utilisateurApi;
        private readonly ITacheApi _tacheApi;
        private readonly ITacheAssignationApi _tacheAssignationApi;
        private readonly IDemandeCongeApi _congeApi;

        public UtilisateurRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<UtilisateurRepository> logger,
            IUtilisateurApi utilisateurApi,
            ITacheApi tacheApi,
            ITacheAssignationApi tacheAssignationApi,
            IDemandeCongeApi congeApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _utilisateurApi = utilisateurApi;
            _tacheApi = tacheApi;
            _tacheAssignationApi = tacheAssignationApi;
            _congeApi = congeApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(UtilisateurCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Utilisateur invalide");

            try
            {
                // Vérification doublon (Nom + Email) - only for new users
                if (string.IsNullOrWhiteSpace(entity.Id) && !string.IsNullOrWhiteSpace(entity.Email))
                {
                    var criteres = new Dictionary<string, string>();
                    if (!string.IsNullOrWhiteSpace(entity.Email)) criteres["Email"] = entity.Email;
                    
                    if (criteres.Count > 0)
                    {
                        var conditionDoublon = new ConditionRecherche { Criteres = criteres };
                        var existants = await ListeParCritereAsync(conditionDoublon);
                        var doublon = existants?.FirstOrDefault(x => x.Id != entity.Id);
                        if (doublon != null)
                            return OperationResult.Fail($"Un(e) Utilisateur avec cet email '{entity.Email}' existe déjà.");
                    }
                }

                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Utilisateur introuvable");

                    var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Utilisateur modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Utilisateur");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastUtilisateurSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("USR", lastSequence, 50, 3);

                var added = await _utilisateurApi.ApiUtilisateursAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Utilisateur ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Utilisateur");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Utilisateur");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastUtilisateurSequenceAsync()
        {
            try
            {
                var list = await _utilisateurApi.ApiUtilisateursListeGetAsync();
                if (list == null || list.Count == 0) return 0;
                return list.Select(x => ExtractSequence(x.Id)).DefaultIfEmpty(0).Max();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur séquence"); return 0;
            }
        }

        private static int ExtractSequence(string? code)
        {
            if (string.IsNullOrWhiteSpace(code)) return 0;
            var m = Regex.Match(code, @"(\d+)$");
            return m.Success ? int.Parse(m.Value) : 0;
        }

        public async Task<UtilisateurCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _utilisateurApi.ApiUtilisateursObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<UtilisateurCore>> ListeAsync()
        {
            try
            {
                var result = await _utilisateurApi.ApiUtilisateursListeGetAsync();
                return result?.AsEnumerable() ?? new List<UtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<UtilisateurCore>(); }
        }

        public async Task<IEnumerable<UtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<UtilisateurCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _utilisateurApi.ApiUtilisateursListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<UtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<UtilisateurCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _utilisateurApi.ApiUtilisateursSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Utilisateur supprimé avec succès")
                             : OperationResult.Fail("Échec de la suppression");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Supprimer"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return OperationResult.Fail("Critère manquant");
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _utilisateurApi.ApiUtilisateursSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<UtilisateurDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<UtilisateurDetailles>();
                var result = new List<UtilisateurDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<UtilisateurDetailles>(); }
        }

        public async Task<IEnumerable<UtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<UtilisateurDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<UtilisateurDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<UtilisateurDetailles>(); }
        }

        private async Task<UtilisateurDetailles> ChargerUtilisateurDetailleAsync(UtilisateurCore item)
        {
            var detail = new UtilisateurDetailles { Utilisateur = item };

            try
            {
                // 1. Récupération des tâches assignées
                var condAssign = new ConditionRecherche { Criteres = new Dictionary<string, string> { { "UtilisateurId", item.Id } } };
                var assignations = await _tacheAssignationApi.TacheassignationListeParConditionPostAsync(SoftProOutils.ToCritereSociete(condAssign));
                
                if (assignations != null && assignations.Any())
                {
                    var taskIds = assignations.Select(a => a.TacheId).ToList();
                    var allTaches = await _tacheApi.ApiTachesListeGetAsync(); // Simplified for now
                    var userTaches = allTaches.Where(t => taskIds.Contains(t.Id)).ToList();

                    if (userTaches.Any())
                    {
                        // 2. Calcul Quality Score
                        int bugs = userTaches.Count(t => (t.Titre?.Contains("Bug", StringComparison.OrdinalIgnoreCase) ?? false) || (t.Description?.Contains("Bug", StringComparison.OrdinalIgnoreCase) ?? false));
                        detail.QualityScore = Math.Max(0, 100 - (bugs * 20));

                        // 3. Calcul Timeliness Score
                        var finishedTasks = userTaches.Where(t => t.Statut == "Terminé").ToList();
                        if (finishedTasks.Any())
                        {
                            int onTime = finishedTasks.Count(t => !t.DateLimite.HasValue || t.DateLimite >= DateTime.Now); // Heuristic
                            detail.TimelinessScore = (double)onTime / finishedTasks.Count * 100;
                        }
                        else { detail.TimelinessScore = 100; }

                        // 4. Collaboration Score (Simulé par l'activité sur les tâches)
                        detail.CollaborationScore = Math.Min(100, userTaches.Count * 10);

                        // 5. Workload & Burnout Risk
                        var activeTasks = userTaches.Where(t => t.Statut != "Terminé").ToList();
                        detail.CurrentWorkloadHours = activeTasks.Sum(t => t.TempsEstime ?? 0);
                        
                        if (detail.CurrentWorkloadHours > 60) detail.BurnoutRisk = "High";
                        else if (detail.CurrentWorkloadHours > 45) detail.BurnoutRisk = "Moderate";
                        else detail.BurnoutRisk = "Low";

                        // 6. Global Performance Score
                        detail.PerformanceScore = Math.Round((detail.QualityScore * 0.4) + (detail.TimelinessScore * 0.4) + (detail.CollaborationScore * 0.2), 2);

                        // 7. Skills Matrix (Mapping auto par titre/description)
                        detail.SkillsMatrix = new Dictionary<string, int>();
                        var text = string.Join(" ", userTaches.Select(t => (t.Titre ?? "") + " " + (t.Description ?? "")));
                        if (text.Contains("Angular", StringComparison.OrdinalIgnoreCase)) detail.SkillsMatrix["Angular"] = (int)detail.PerformanceScore;
                        if (text.Contains("SQL", StringComparison.OrdinalIgnoreCase)) detail.SkillsMatrix["SQL"] = (int)detail.PerformanceScore;
                        if (text.Contains("C#", StringComparison.OrdinalIgnoreCase) || text.Contains("Backend", StringComparison.OrdinalIgnoreCase)) detail.SkillsMatrix["DotNet"] = (int)detail.PerformanceScore;
                        if (text.Contains("Design", StringComparison.OrdinalIgnoreCase)) detail.SkillsMatrix["Design"] = (int)detail.PerformanceScore;
                    }
                }
                else
                {
                    detail.PerformanceScore = 0;
                    detail.BurnoutRisk = "None";
                    detail.SkillsMatrix = new Dictionary<string, int>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erreur calcul RH pour {item.Id}");
            }

            return detail;
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<UtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<UtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<UtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<UtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<OperationResult> ModifierMotDePasseConnecteAsync(string id, string ancienMotDePasse, string nouveauMotDePasse)
        {
            try
            {
                var user = await ObtenirAsync(id);
                if (user == null) return OperationResult.Fail("Utilisateur introuvable");

                bool isPasswordValid = false;
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(ancienMotDePasse, user.MotDePasse);
                }
                catch
                {
                    // Fallback for plain text passwords if they are not hashed yet
                    isPasswordValid = user.MotDePasse == ancienMotDePasse;
                }

                if (!isPasswordValid)
                    return OperationResult.Fail("L'ancien mot de passe est incorrect");

                user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(nouveauMotDePasse);
                user.Cv ??= ""; // Ensure CV is not null to pass validation
                var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(user);
                return updated ? OperationResult.Ok("Mot de passe modifié avec succès") : OperationResult.Fail("Échec de la modification");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur ModifierMotDePasseConnecte");
                return OperationResult.Fail(ex.Message);
            }
        }

        public async Task<OperationResult> ModifierMotDePasseHorsLigneAsync(string email, string nouveauMotDePasse)
        {
            try
            {
                var condition = new ConditionRecherche { Criteres = new Dictionary<string, string> { { "Email", email } } };
                var users = await ListeParCritereAsync(condition);
                var user = users?.FirstOrDefault();

                if (user == null) return OperationResult.Fail("Utilisateur introuvable");

                user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(nouveauMotDePasse);
                user.Cv ??= ""; // Ensure CV is not null to pass validation
                var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(user);
                return updated ? OperationResult.Ok("Mot de passe réinitialisé avec succès") : OperationResult.Fail("Échec de la réinitialisation");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur ModifierMotDePasseHorsLigne");
                return OperationResult.Fail(ex.Message);
            }
        }

    }
}
