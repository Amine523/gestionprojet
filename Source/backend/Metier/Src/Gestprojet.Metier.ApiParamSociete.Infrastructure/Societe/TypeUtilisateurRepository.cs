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
    public class TypeUtilisateurRepository : ITypeUtilisateurRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<TypeUtilisateurRepository> _logger;
        private readonly ITypeUtilisateurApi _typeUtilisateurApi;

        public TypeUtilisateurRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<TypeUtilisateurRepository> logger,
            ITypeUtilisateurApi typeUtilisateurApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _typeUtilisateurApi = typeUtilisateurApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(TypeUtilisateurCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("TypeUtilisateur invalide");

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
                        return OperationResult.Fail($"Un(e) TypeUtilisateur avec (Nom) '{entity.Nom}' existe déjà.");
                }

                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("TypeUtilisateur introuvable");

                    var updated = await _typeUtilisateurApi.ApiUtilisateursTypesModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("TypeUtilisateur modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) TypeUtilisateur");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastTypeUtilisateurSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("TU", lastSequence, 50, 3);

                var added = await _typeUtilisateurApi.ApiUtilisateursTypesAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("TypeUtilisateur ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) TypeUtilisateur");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) TypeUtilisateur");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastTypeUtilisateurSequenceAsync()
        {
            try
            {
                var list = await _typeUtilisateurApi.ApiUtilisateursTypesListeGetAsync();
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

        public async Task<TypeUtilisateurCore> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _typeUtilisateurApi.ApiUtilisateursTypesObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<TypeUtilisateurCore>> ListeAsync()
        {
            try
            {
                var result = await _typeUtilisateurApi.ApiUtilisateursTypesListeGetAsync();
                return result?.AsEnumerable() ?? new List<TypeUtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<TypeUtilisateurCore>(); }
        }

        public async Task<IEnumerable<TypeUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<TypeUtilisateurCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _typeUtilisateurApi.ApiUtilisateursTypesListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<TypeUtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<TypeUtilisateurCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _typeUtilisateurApi.ApiUtilisateursTypesSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("TypeUtilisateur supprimé avec succès")
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
                var result = await _typeUtilisateurApi.ApiUtilisateursTypesSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<ResultatPage<TypeUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<TypeUtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<TypeUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<TypeUtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
