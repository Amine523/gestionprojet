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
    public class SocieteRepository : ISocieteRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<SocieteRepository> _logger;
        private readonly ISocieteApi _societeApi;

        public SocieteRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<SocieteRepository> logger,
            ISocieteApi societeApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _societeApi = societeApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(SocieteCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Societe invalide");

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
                        return OperationResult.Fail($"Un(e) Societe avec (Nom) '{entity.Nom}' existe déjà.");
                }

                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Societe introuvable");

                    var updated = await _societeApi.ApiSocietesModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Societe modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Societe");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastSocieteSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("SOC", lastSequence, 50, 3);

                var added = await _societeApi.ApiSocietesAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Societe ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Societe");
            }
            catch (Gestprojet.Core.ApiParamSociete.Client.Client.ApiException apiEx)
            {
                _logger.LogError(apiEx, $"ApiException lors de l'appel Core: {apiEx.ErrorContent}");
                return OperationResult.Fail($"Erreur API Core : {apiEx.Message} - {apiEx.ErrorContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Societe");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastSocieteSequenceAsync()
        {
            try
            {
                var list = await _societeApi.ApiSocietesListeGetAsync();
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

        public async Task<SocieteCore> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _societeApi.ApiSocietesObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<SocieteCore>> ListeAsync()
        {
            try
            {
                var result = await _societeApi.ApiSocietesListeGetAsync();
                return result?.AsEnumerable() ?? new List<SocieteCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<SocieteCore>(); }
        }

        public async Task<IEnumerable<SocieteCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<SocieteCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _societeApi.ApiSocietesListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<SocieteCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<SocieteCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _societeApi.ApiSocietesSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Societe supprimé avec succès")
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
                var result = await _societeApi.ApiSocietesSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<ResultatPage<SocieteCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<SocieteCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<SocieteCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<SocieteCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
