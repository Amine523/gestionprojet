using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Application.Societe
{
    public class UtilisateurBusiness : IUtilisateurBusiness
    {
        private readonly IUtilisateurRepository _repository;

        public UtilisateurBusiness(IUtilisateurRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(UtilisateurCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<UtilisateurCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<UtilisateurCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<UtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<IEnumerable<UtilisateurDetailles>> ListeDetailleAsync() => _repository.ListeDetailleAsync();
        public Task<IEnumerable<UtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere) => _repository.ListeDetailleParConditionAsync(critere);
        public Task<ResultatPage<UtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<UtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille) => _repository.ListeDetailleParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeDetailleParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<OperationResult> ModifierMotDePasseConnecteAsync(string id, string ancienMotDePasse, string nouveauMotDePasse) => _repository.ModifierMotDePasseConnecteAsync(id, ancienMotDePasse, nouveauMotDePasse);
        public Task<OperationResult> ModifierMotDePasseHorsLigneAsync(string email, string nouveauMotDePasse) => _repository.ModifierMotDePasseHorsLigneAsync(email, nouveauMotDePasse);
    }
}
