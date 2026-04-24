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
    public class TacheAssignationRepository : ITacheAssignationRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<TacheAssignationRepository> _logger;
        private readonly ITacheAssignationApi _tacheAssignationApi;

        public TacheAssignationRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<TacheAssignationRepository> logger,
            ITacheAssignationApi tacheAssignationApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _tacheAssignationApi = tacheAssignationApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(TacheAssignationCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("TacheAssignation invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("TacheAssignation introuvable");

                    var updated = await _tacheAssignationApi.TacheassignationModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("TacheAssignation modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) TacheAssignation");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastTacheAssignationSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("TAS", lastSequence, 50, 3);

                var added = await _tacheAssignationApi.TacheassignationAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("TacheAssignation ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) TacheAssignation");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) TacheAssignation");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastTacheAssignationSequenceAsync()
        {
            try
            {
                var list = await _tacheAssignationApi.TacheassignationListeGetAsync();
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

        public async Task<TacheAssignationCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _tacheAssignationApi.TacheassignationObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<TacheAssignationCore>> ListeAsync()
        {
            try
            {
                var result = await _tacheAssignationApi.TacheassignationListeGetAsync();
                return result?.AsEnumerable() ?? new List<TacheAssignationCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<TacheAssignationCore>(); }
        }

        public async Task<IEnumerable<TacheAssignationCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<TacheAssignationCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _tacheAssignationApi.TacheassignationListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<TacheAssignationCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<TacheAssignationCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _tacheAssignationApi.TacheassignationSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("TacheAssignation supprimé avec succès")
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
                var result = await _tacheAssignationApi.TacheassignationSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<TacheAssignationDetailles>();
                var result = new List<TacheAssignationDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerTacheAssignationDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<TacheAssignationDetailles>(); }
        }

        public async Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<TacheAssignationDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<TacheAssignationDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerTacheAssignationDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<TacheAssignationDetailles>(); }
        }

        private Task<TacheAssignationDetailles> ChargerTacheAssignationDetailleAsync(TacheAssignationCore item)
        {
            return Task.FromResult(new TacheAssignationDetailles { TacheAssignation = item });
        }

        public async Task<ResultatPage<TacheAssignationCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<TacheAssignationCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheAssignationCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<TacheAssignationCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<TacheAssignationDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<TacheAssignationDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
