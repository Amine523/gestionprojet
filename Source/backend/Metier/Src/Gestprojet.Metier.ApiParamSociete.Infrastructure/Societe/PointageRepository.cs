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
    public class PointageRepository : IPointageRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<PointageRepository> _logger;
        private readonly IPointageApi _pointageApi;

        public PointageRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<PointageRepository> logger,
            IPointageApi pointageApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _pointageApi = pointageApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(PointageCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Pointage invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Pointage introuvable");

                    var updated = await _pointageApi.PointageModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Pointage modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Pointage");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastPointageSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("POI", lastSequence, 50, 3);

                var added = await _pointageApi.PointageAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Pointage ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Pointage");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Pointage");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastPointageSequenceAsync()
        {
            try
            {
                var list = await _pointageApi.PointageListeGetAsync();
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

        public async Task<PointageCore> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _pointageApi.PointageObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<PointageCore>> ListeAsync()
        {
            try
            {
                var result = await _pointageApi.PointageListeGetAsync();
                return result?.AsEnumerable() ?? new List<PointageCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<PointageCore>(); }
        }

        public async Task<IEnumerable<PointageCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<PointageCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _pointageApi.PointageListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<PointageCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<PointageCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _pointageApi.PointageSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Pointage supprimé avec succès")
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
                var result = await _pointageApi.PointageSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<PointageDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<PointageDetailles>();
                var result = new List<PointageDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerPointageDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<PointageDetailles>(); }
        }

        public async Task<IEnumerable<PointageDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<PointageDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<PointageDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerPointageDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<PointageDetailles>(); }
        }

        private Task<PointageDetailles> ChargerPointageDetailleAsync(PointageCore item)
        {
            return Task.FromResult(new PointageDetailles { Pointage = item });
        }

        public async Task<ResultatPage<PointageCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<PointageCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PointageCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<PointageCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PointageDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<PointageDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PointageDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<PointageDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
