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
    public class ProjetUtilisateurBusiness : IProjetUtilisateurBusiness
    {
        private readonly IProjetUtilisateurRepository _repository;

        public ProjetUtilisateurBusiness(IProjetUtilisateurRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(ProjetUtilisateurCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<ProjetUtilisateurCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<ProjetUtilisateurCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<ProjetUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleAsync() => _repository.ListeDetailleAsync();
        public Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere) => _repository.ListeDetailleParConditionAsync(critere);
        public Task<ResultatPage<ProjetUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<ProjetUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille) => _repository.ListeDetailleParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeDetailleParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
