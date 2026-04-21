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
    public class TypeUtilisateurBusiness : ITypeUtilisateurBusiness
    {
        private readonly ITypeUtilisateurRepository _repository;

        public TypeUtilisateurBusiness(ITypeUtilisateurRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(TypeUtilisateurCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<TypeUtilisateurCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<TypeUtilisateurCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<TypeUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<ResultatPage<TypeUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<TypeUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
