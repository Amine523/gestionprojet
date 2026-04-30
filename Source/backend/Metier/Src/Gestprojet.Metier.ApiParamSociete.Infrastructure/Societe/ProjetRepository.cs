using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Commun;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe
{
    public class ProjetRepository : IProjetRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<ProjetRepository> _logger;
        private readonly IProjetApi _projetApi;
        private readonly ITacheApi _tacheApi;

        public ProjetRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<ProjetRepository> logger,
            IProjetApi projetApi,
            ITacheApi tacheApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _projetApi = projetApi;
            _tacheApi = tacheApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(ProjetCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Projet invalide");

            try
            {
                // Vérification doublon (Nom)
                if (!string.IsNullOrWhiteSpace(entity.Nom))
                {
                    var conditionDoublon = new ConditionRecherche
                    {
                        Criteres = new Dictionary<string, string> { { "Nom", entity.Nom } }
                    };
                    var existants = await ListeParCritereAsync(conditionDoublon);
                    var doublon = existants?.FirstOrDefault(x => x.Id != entity.Id);
                    if (doublon != null)
                        return OperationResult.Fail($"Un(e) Projet avec (Nom) '{entity.Nom}' existe déjà.");
                }

                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Projet introuvable");

                    var updated = await _projetApi.ApiProjetsModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Projet modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Projet");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastProjetSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("PRJ", lastSequence, 50, 3);

                var added = await _projetApi.ApiProjetsAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Projet ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Projet");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Projet");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastProjetSequenceAsync()
        {
            try
            {
                var list = await _projetApi.ApiProjetsListeGetAsync();
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

        public async Task<ProjetCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _projetApi.ApiProjetsObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<ProjetCore>> ListeAsync()
        {
            try
            {
                var result = await _projetApi.ApiProjetsListeGetAsync();
                return result?.AsEnumerable() ?? new List<ProjetCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<ProjetCore>(); }
        }

        public async Task<IEnumerable<ProjetCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ProjetCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _projetApi.ApiProjetsListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<ProjetCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<ProjetCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _projetApi.ApiProjetsSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Projet supprimé avec succès")
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
                var result = await _projetApi.ApiProjetsSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<ProjetDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<ProjetDetailles>();
                var result = new List<ProjetDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerProjetDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<ProjetDetailles>(); }
        }

        public async Task<IEnumerable<ProjetDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ProjetDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<ProjetDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerProjetDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<ProjetDetailles>(); }
        }

        private async Task<ProjetDetailles> ChargerProjetDetailleAsync(ProjetCore item)
        {
            var detail = new ProjetDetailles { Projet = item };

            try
            {
                // 1. Récupération des tâches du projet
                var conditionTaches = new ConditionRecherche
                {
                    Criteres = new Dictionary<string, string> { { "ProjetId", item.Id } }
                };
                var taches = await _tacheApi.ApiTachesListeParConditionPostAsync(SoftProOutils.ToCritereSociete(conditionTaches));

                if (taches != null && taches.Any())
                {
                    // 2. Calcul de la progression pondérée
                    double totalEstime = taches.Sum(t => t.TempsEstime ?? 0);
                    double totalTermine = taches.Where(t => t.Statut == "Terminé").Sum(t => t.TempsEstime ?? 0);

                    detail.AvanceeCalculee = totalEstime > 0 ? Math.Round((totalTermine / totalEstime) * 100, 2) : 0;

                    // 3. Calcul du Health Score (Comparaison Timeline)
                    if (item.StartDate.HasValue && item.EndDate.HasValue)
                    {
                        var totalDays = (item.EndDate.Value - item.StartDate.Value).TotalDays;
                        var elapsedDays = (DateTime.Now - item.StartDate.Value).TotalDays;
                        
                        if (totalDays > 0)
                        {
                            double expectedProgress = Math.Min(100, Math.Max(0, (elapsedDays / totalDays) * 100));
                            double diff = detail.AvanceeCalculee - expectedProgress;

                            if (diff >= 0) { detail.HealthColor = "Vert"; detail.HealthScore = 100; }
                            else if (diff > -15) { detail.HealthColor = "Orange"; detail.HealthScore = 70; }
                            else { detail.HealthColor = "Rouge"; detail.HealthScore = 30; }
                        }
                    }
                    else
                    {
                        detail.HealthColor = "Orange";
                        detail.HealthScore = 50;
                    }

                    // 4. Prédiction d'Atterrissage (AI-Lite)
                    // Basé sur la vélocité : progression par jour depuis le début
                    if (item.StartDate.HasValue && detail.AvanceeCalculee > 0)
                    {
                        var daysSinceStart = (DateTime.Now - item.StartDate.Value).TotalDays;
                        if (daysSinceStart > 0)
                        {
                            double velocity = detail.AvanceeCalculee / daysSinceStart; // % par jour
                            if (velocity > 0)
                            {
                                double remainingPercent = 100 - detail.AvanceeCalculee;
                                double remainingDays = remainingPercent / velocity;
                                detail.EndDatePredicted = DateTime.Now.AddDays(remainingDays);
                            }
                        }
                    }
                }
                else
                {
                    detail.HealthColor = "Vert"; // Pas de tâches = pas de retard
                    detail.HealthScore = 100;
                    detail.AvanceeCalculee = 0;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erreur lors du calcul des indicateurs pour le projet {item.Id}");
                detail.HealthColor = "Orange";
            }

            return detail;
        }

        public async Task<ResultatPage<ProjetCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<ProjetCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<ProjetCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<ProjetDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<ProjetDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<IEnumerable<ProjetCore>> ListeParSocieteAsync(string societeId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(societeId)) return new List<ProjetCore>();
                var critere = new ConditionRecherche
                {
                    Criteres = new Dictionary<string, string> { { "SocieteId", societeId } }
                };
                return await ListeParCritereAsync(critere);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParSociete"); return new List<ProjetCore>(); }
        }

    }
}
