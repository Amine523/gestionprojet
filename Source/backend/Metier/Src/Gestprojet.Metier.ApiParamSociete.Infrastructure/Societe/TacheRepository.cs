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
    public class TacheRepository : ITacheRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<TacheRepository> _logger;
        private readonly ITacheApi _tacheApi;

        public TacheRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<TacheRepository> logger,
            ITacheApi tacheApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _tacheApi = tacheApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(TacheCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Tache invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Tache introuvable");

                    var updated = await _tacheApi.ApiTachesModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Tache modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Tache");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastTacheSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("TAC", lastSequence, 50, 3);

                var added = await _tacheApi.ApiTachesAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Tache ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Tache");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Tache");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastTacheSequenceAsync()
        {
            try
            {
                var list = await _tacheApi.ApiTachesListeGetAsync();
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

        public async Task<TacheCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _tacheApi.ApiTachesObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<TacheCore>> ListeAsync()
        {
            try
            {
                var result = await _tacheApi.ApiTachesListeGetAsync();
                return result?.AsEnumerable() ?? new List<TacheCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<TacheCore>(); }
        }

        public async Task<IEnumerable<TacheCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<TacheCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _tacheApi.ApiTachesListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<TacheCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<TacheCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _tacheApi.ApiTachesSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Tache supprimé avec succès")
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
                var result = await _tacheApi.ApiTachesSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<TacheDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<TacheDetailles>();
                var result = new List<TacheDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerTacheDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<TacheDetailles>(); }
        }

        public async Task<IEnumerable<TacheDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<TacheDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<TacheDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerTacheDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<TacheDetailles>(); }
        }

        private Task<TacheDetailles> ChargerTacheDetailleAsync(TacheCore item)
        {
            return Task.FromResult(new TacheDetailles { Tache = item });
        }

        public async Task<ResultatPage<TacheCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<TacheCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<TacheCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<TacheDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TacheDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<TacheDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
