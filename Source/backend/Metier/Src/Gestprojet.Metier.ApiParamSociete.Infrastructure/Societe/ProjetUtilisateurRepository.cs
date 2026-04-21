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
    public class ProjetUtilisateurRepository : IProjetUtilisateurRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<ProjetUtilisateurRepository> _logger;
        private readonly IProjetUtilisateurApi _projetUtilisateurApi;

        public ProjetUtilisateurRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<ProjetUtilisateurRepository> logger,
            IProjetUtilisateurApi projetUtilisateurApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _projetUtilisateurApi = projetUtilisateurApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(ProjetUtilisateurCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("ProjetUtilisateur invalide");

            try
            {
                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("ProjetUtilisateur introuvable");

                    var updated = await _projetUtilisateurApi.ProjetutilisateurModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("ProjetUtilisateur modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) ProjetUtilisateur");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastProjetUtilisateurSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("PRU", lastSequence, 50, 3);

                var added = await _projetUtilisateurApi.ProjetutilisateurAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("ProjetUtilisateur ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) ProjetUtilisateur");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) ProjetUtilisateur");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastProjetUtilisateurSequenceAsync()
        {
            try
            {
                var list = await _projetUtilisateurApi.ProjetutilisateurListeGetAsync();
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

        public async Task<ProjetUtilisateurCore> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _projetUtilisateurApi.ProjetutilisateurObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<ProjetUtilisateurCore>> ListeAsync()
        {
            try
            {
                var result = await _projetUtilisateurApi.ProjetutilisateurListeGetAsync();
                return result?.AsEnumerable() ?? new List<ProjetUtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<ProjetUtilisateurCore>(); }
        }

        public async Task<IEnumerable<ProjetUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ProjetUtilisateurCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _projetUtilisateurApi.ProjetutilisateurListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<ProjetUtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<ProjetUtilisateurCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _projetUtilisateurApi.ProjetutilisateurSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("ProjetUtilisateur supprimé avec succès")
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
                var result = await _projetUtilisateurApi.ProjetutilisateurSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<ProjetUtilisateurDetailles>();
                var result = new List<ProjetUtilisateurDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerProjetUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<ProjetUtilisateurDetailles>(); }
        }

        public async Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<ProjetUtilisateurDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<ProjetUtilisateurDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerProjetUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<ProjetUtilisateurDetailles>(); }
        }

        private Task<ProjetUtilisateurDetailles> ChargerProjetUtilisateurDetailleAsync(ProjetUtilisateurCore item)
        {
            return Task.FromResult(new ProjetUtilisateurDetailles { ProjetUtilisateur = item });
        }

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<ProjetUtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<ProjetUtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<ProjetUtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<ProjetUtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

    }
}
