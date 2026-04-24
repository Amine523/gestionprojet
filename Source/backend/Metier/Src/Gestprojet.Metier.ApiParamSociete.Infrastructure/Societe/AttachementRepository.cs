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
    public class AttachementRepository : IAttachementRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<AttachementRepository> _logger;
        private readonly IAttachementApi _attachementApi;

        public AttachementRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<AttachementRepository> logger,
            IAttachementApi attachementApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _attachementApi = attachementApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(AttachementCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Attachement invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Attachement introuvable");

                    var updated = await _attachementApi.AttachementModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Attachement modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Attachement");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastAttachementSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("ATT", lastSequence, 50, 3);

                var added = await _attachementApi.AttachementAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Attachement ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Attachement");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Attachement");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastAttachementSequenceAsync()
        {
            try
            {
                var list = await _attachementApi.AttachementListeGetAsync();
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

        public async Task<AttachementCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _attachementApi.AttachementObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<AttachementCore>> ListeAsync()
        {
            try
            {
                var result = await _attachementApi.AttachementListeGetAsync();
                return result?.AsEnumerable() ?? new List<AttachementCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<AttachementCore>(); }
        }

        public async Task<IEnumerable<AttachementCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<AttachementCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _attachementApi.AttachementListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<AttachementCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<AttachementCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _attachementApi.AttachementSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Attachement supprimé avec succès")
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
                var result = await _attachementApi.AttachementSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<AttachementDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<AttachementDetailles>();
                var result = new List<AttachementDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerAttachementDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<AttachementDetailles>(); }
        }

        public async Task<IEnumerable<AttachementDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<AttachementDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<AttachementDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerAttachementDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<AttachementDetailles>(); }
        }

        private Task<AttachementDetailles> ChargerAttachementDetailleAsync(AttachementCore item)
        {
            return Task.FromResult(new AttachementDetailles { Attachement = item });
        }

        public async Task<ResultatPage<AttachementCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<AttachementCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<AttachementCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<AttachementCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<AttachementDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<AttachementDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<AttachementDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<AttachementDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
