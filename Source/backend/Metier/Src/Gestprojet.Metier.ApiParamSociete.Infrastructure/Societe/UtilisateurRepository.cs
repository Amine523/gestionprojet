using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Commun;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe
{
    public class UtilisateurRepository : IUtilisateurRepository
    {
        private readonly ICodeGenerationService _codeGenerationService;
        private readonly ILogger<UtilisateurRepository> _logger;
        private readonly IUtilisateurApi _utilisateurApi;

        public UtilisateurRepository(
            ICodeGenerationService codeGenerationService,
            ILogger<UtilisateurRepository> logger,
            IUtilisateurApi utilisateurApi)
        {
            _codeGenerationService = codeGenerationService;
            _logger = logger;
            _utilisateurApi = utilisateurApi;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(UtilisateurCore entity)
        {
            if (entity == null)
                return OperationResult.Fail("Utilisateur invalide");

            try
            {
                // Vérification doublon (Nom + Email + CV)
                if (!string.IsNullOrWhiteSpace(entity.Nom))
                {
                    var conditionDoublon = new ConditionRecherche
                    {
                        Criteres = new Dictionary<string, string> { { "Nom", entity.Nom }, { "Email", entity.Email }, { "CV", entity.Cv } }
                    };
                    var existants = await ListeParCritereAsync(conditionDoublon);
                    var doublon = existants?.FirstOrDefault(x => x.Id != entity.Id);
                    if (doublon != null)
                        return OperationResult.Fail($"Un(e) Utilisateur avec (Nom + Email + CV) '{entity.Nom} / {entity.Email} / {entity.Cv}' existe déjà.");
                }

                // ==========================
                // UPDATE
                // ==========================
                if (!string.IsNullOrWhiteSpace(entity.Id))
                {
                    var existant = await ObtenirAsync(entity.Id);
                    if (existant == null)
                        return OperationResult.Fail("Utilisateur introuvable");

                    var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(entity);
                    return updated
                        ? OperationResult.Ok("Utilisateur modifié avec succès")
                        : OperationResult.Fail("Échec de la modification de un(e) Utilisateur");
                }

                // ==========================
                // ADD (Generate Code)
                // ==========================
                var lastSequence = await GetLastUtilisateurSequenceAsync();
                entity.Id = _codeGenerationService.GenerateCode("USR", lastSequence, 50, 3);

                var added = await _utilisateurApi.ApiUtilisateursAjouterPostAsync(entity);
                return added
                    ? OperationResult.Ok("Utilisateur ajouté avec succès")
                    : OperationResult.Fail("Échec de l'ajout de un(e) Utilisateur");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout ou modification de un(e) Utilisateur");
                return OperationResult.Fail($"Erreur technique : {ex.Message}");
            }
        }

        private async Task<int> GetLastUtilisateurSequenceAsync()
        {
            try
            {
                var list = await _utilisateurApi.ApiUtilisateursListeGetAsync();
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

        public async Task<UtilisateurCore?> ObtenirAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return null;
                return await _utilisateurApi.ApiUtilisateursObtenirIdIdGetAsync(id);
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Obtenir"); return null; }
        }

        public async Task<IEnumerable<UtilisateurCore>> ListeAsync()
        {
            try
            {
                var result = await _utilisateurApi.ApiUtilisateursListeGetAsync();
                return result?.AsEnumerable() ?? new List<UtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur Liste"); return new List<UtilisateurCore>(); }
        }

        public async Task<IEnumerable<UtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<UtilisateurCore>();
                var c = SoftProOutils.ToCritereSociete(critere);
                var result = await _utilisateurApi.ApiUtilisateursListeParConditionPostAsync(c);
                return result?.AsEnumerable() ?? new List<UtilisateurCore>();
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeParCritere"); return new List<UtilisateurCore>(); }
        }

        public async Task<OperationResult> SupprimerAsync(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id)) return OperationResult.Fail("Id requis");
                var result = await _utilisateurApi.ApiUtilisateursSupprimerIdIdDeleteAsync(id);
                return result ? OperationResult.Ok("Utilisateur supprimé avec succès")
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
                var result = await _utilisateurApi.ApiUtilisateursSupprimerParConditionPostAsync(c);
                return result ? OperationResult.Ok("Suppression par condition réussie")
                             : OperationResult.Fail("Échec de la suppression par condition");
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur SupprimerParCondition"); return OperationResult.Fail(ex.Message); }
        }

        public async Task<IEnumerable<UtilisateurDetailles>> ListeDetailleAsync()
        {
            try
            {
                var liste = await ListeAsync();
                if (liste == null || !liste.Any()) return new List<UtilisateurDetailles>();
                var result = new List<UtilisateurDetailles>();
                foreach (var item in liste)
                    result.Add(await ChargerUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetaille"); return new List<UtilisateurDetailles>(); }
        }

        public async Task<IEnumerable<UtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere)
        {
            try
            {
                if (critere == null) return new List<UtilisateurDetailles>();
                var items = await ListeParCritereAsync(critere);
                var result = new List<UtilisateurDetailles>();
                foreach (var item in items)
                    result.Add(await ChargerUtilisateurDetailleAsync(item));
                return result;
            }
            catch (Exception ex) { _logger.LogError(ex, "Erreur ListeDetailleParCondition"); return new List<UtilisateurDetailles>(); }
        }

        private Task<UtilisateurDetailles> ChargerUtilisateurDetailleAsync(UtilisateurCore item)
        {
            return Task.FromResult(new UtilisateurDetailles { Utilisateur = item });
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeAsync()).ToList();
            return new ResultatPage<UtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeParCritereAsync(critere)).ToList();
            return new ResultatPage<UtilisateurCore>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleAsync()).ToList();
            return new ResultatPage<UtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille)
        {
            var all = (await ListeDetailleParConditionAsync(critere)).ToList();
            return new ResultatPage<UtilisateurDetailles>
            {
                Items = all.Skip((pageNumero - 1) * pageTaille).Take(pageTaille).ToList(),
                TotalCount = all.Count,
                PageNumber = pageNumero,
                PageSize = pageTaille
            };
        }

        public async Task<OperationResult> ModifierMotDePasseConnecteAsync(string id, string ancienMotDePasse, string nouveauMotDePasse)
        {
            try
            {
                var user = await ObtenirAsync(id);
                if (user == null) return OperationResult.Fail("Utilisateur introuvable");

                bool isPasswordValid = false;
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(ancienMotDePasse, user.MotDePasse);
                }
                catch
                {
                    // Fallback for plain text passwords if they are not hashed yet
                    isPasswordValid = user.MotDePasse == ancienMotDePasse;
                }

                if (!isPasswordValid)
                    return OperationResult.Fail("L'ancien mot de passe est incorrect");

                user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(nouveauMotDePasse);
                user.Cv ??= ""; // Ensure CV is not null to pass validation
                var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(user);
                return updated ? OperationResult.Ok("Mot de passe modifié avec succès") : OperationResult.Fail("Échec de la modification");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur ModifierMotDePasseConnecte");
                return OperationResult.Fail(ex.Message);
            }
        }

        public async Task<OperationResult> ModifierMotDePasseHorsLigneAsync(string email, string nouveauMotDePasse)
        {
            try
            {
                var condition = new ConditionRecherche { Criteres = new Dictionary<string, string> { { "Email", email } } };
                var users = await ListeParCritereAsync(condition);
                var user = users?.FirstOrDefault();

                if (user == null) return OperationResult.Fail("Utilisateur introuvable");

                user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(nouveauMotDePasse);
                user.Cv ??= ""; // Ensure CV is not null to pass validation
                var updated = await _utilisateurApi.ApiUtilisateursModifierPutAsync(user);
                return updated ? OperationResult.Ok("Mot de passe réinitialisé avec succès") : OperationResult.Fail("Échec de la réinitialisation");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur ModifierMotDePasseHorsLigne");
                return OperationResult.Fail(ex.Message);
            }
        }

    }
}
