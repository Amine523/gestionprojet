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
    public class PermissionRepository : IPermissionRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<PermissionRepository> _logger;
        private readonly IPermissionApi _permissionApi;

        public PermissionRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<PermissionRepository> logger,
            IPermissionApi permissionApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _permissionApi = permissionApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(PermissionCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Permission invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Permission introuvable");

                    var updated = await _permissionApi.PermissionModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Permission modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Permission");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastPermissionSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("PER", lastSequence, 50, 3);

                var added = await _permissionApi.PermissionAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Permission ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Permission");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Permission");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastPermissionSequenceAsync()
        {
            try
            {
                var list = await _permissionApi.PermissionListeGetAsync();
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

        public async Task<PermissionCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _permissionApi.PermissionObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<PermissionCore>> ListeAsync()
        {
            try
            {
                var result = await _permissionApi.PermissionListeGetAsync();
                return result?.AsEnumerable() ?? new List<PermissionCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<PermissionCore>(); }
        }

        public async Task<IEnumerable<PermissionCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<PermissionCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _permissionApi.PermissionListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<PermissionCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<PermissionCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _permissionApi.PermissionSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Permission supprimé avec succès")
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
                var result = await _permissionApi.PermissionSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<PermissionDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<PermissionDetailles>();
                var result = new List<PermissionDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerPermissionDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<PermissionDetailles>(); }
        }

        public async Task<IEnumerable<PermissionDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<PermissionDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<PermissionDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerPermissionDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<PermissionDetailles>(); }
        }

        private Task<PermissionDetailles> ChargerPermissionDetailleAsync(PermissionCore item)
        {
            return Task.FromResult(new PermissionDetailles { Permission = item });
        }

        public async Task<ResultatPage<PermissionCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<PermissionCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PermissionCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<PermissionCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PermissionDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<PermissionDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<PermissionDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<PermissionDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
