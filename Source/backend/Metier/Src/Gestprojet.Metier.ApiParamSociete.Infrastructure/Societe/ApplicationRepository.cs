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
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<ApplicationRepository> _logger;
        private readonly IApplicationApi _applicationApi;

        public ApplicationRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<ApplicationRepository> logger,
            IApplicationApi applicationApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _applicationApi = applicationApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(ApplicationCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Application invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Application introuvable");

                    var updated = await _applicationApi.ApplicationModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Application modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Application");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastApplicationSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("APP", lastSequence, 50, 3);

                var added = await _applicationApi.ApplicationAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Application ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Application");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Application");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastApplicationSequenceAsync()
        {
            try
            {
                var list = await _applicationApi.ApplicationListeGetAsync();
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

        public async Task<ApplicationCore> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _applicationApi.ApplicationObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<ApplicationCore>> ListeAsync()
        {
            try
            {
                var result = await _applicationApi.ApplicationListeGetAsync();
                return result?.AsEnumerable() ?? new List<ApplicationCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<ApplicationCore>(); }
        }

        public async Task<IEnumerable<ApplicationCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ApplicationCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _applicationApi.ApplicationListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<ApplicationCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<ApplicationCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _applicationApi.ApplicationSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Application supprimé avec succès")
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
                var result = await _applicationApi.ApplicationSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<ApplicationDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<ApplicationDetailles>();
                var result = new List<ApplicationDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerApplicationDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<ApplicationDetailles>(); }
        }

        public async Task<IEnumerable<ApplicationDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ApplicationDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<ApplicationDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerApplicationDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<ApplicationDetailles>(); }
        }

        private Task<ApplicationDetailles> ChargerApplicationDetailleAsync(ApplicationCore item)
        {
            return Task.FromResult(new ApplicationDetailles { Application = item });
        }

        public async Task<ResultatPage<ApplicationCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<ApplicationCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ApplicationCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<ApplicationCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ApplicationDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<ApplicationDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ApplicationDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<ApplicationDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
