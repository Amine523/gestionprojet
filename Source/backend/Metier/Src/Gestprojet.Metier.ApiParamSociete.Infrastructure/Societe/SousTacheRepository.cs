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
    public class SousTacheRepository : ISousTacheRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<SousTacheRepository> _logger;
        private readonly ISousTacheApi _sousTacheApi;

        public SousTacheRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<SousTacheRepository> logger,
            ISousTacheApi sousTacheApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _sousTacheApi = sousTacheApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(SousTacheCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("SousTache invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("SousTache introuvable");

                    var updated = await _sousTacheApi.SoustacheModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("SousTache modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) SousTache");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastSousTacheSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("ST", lastSequence, 50, 3);

                var added = await _sousTacheApi.SoustacheAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("SousTache ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) SousTache");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) SousTache");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastSousTacheSequenceAsync()
        {
            try
            {
                var list = await _sousTacheApi.SoustacheListeGetAsync();
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

        public async Task<SousTacheCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _sousTacheApi.SoustacheObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<SousTacheCore>> ListeAsync()
        {
            try
            {
                var result = await _sousTacheApi.SoustacheListeGetAsync();
                return result?.AsEnumerable() ?? new List<SousTacheCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<SousTacheCore>(); }
        }

        public async Task<IEnumerable<SousTacheCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<SousTacheCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _sousTacheApi.SoustacheListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<SousTacheCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<SousTacheCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _sousTacheApi.SoustacheSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("SousTache supprimé avec succès")
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
                var result = await _sousTacheApi.SoustacheSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<SousTacheDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<SousTacheDetailles>();
                var result = new List<SousTacheDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerSousTacheDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<SousTacheDetailles>(); }
        }

        public async Task<IEnumerable<SousTacheDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<SousTacheDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<SousTacheDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerSousTacheDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<SousTacheDetailles>(); }
        }

        private Task<SousTacheDetailles> ChargerSousTacheDetailleAsync(SousTacheCore item)
        {
            return Task.FromResult(new SousTacheDetailles { SousTache = item });
        }

        public async Task<ResultatPage<SousTacheCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<SousTacheCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<SousTacheCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<SousTacheCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<SousTacheDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<SousTacheDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<SousTacheDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<SousTacheDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
