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
    public class TypeBusiness : ITypeBusiness
    {
        private readonly ITypeRepository _repository;

        public TypeBusiness(ITypeRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(TypeCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<TypeCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<TypeCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<TypeCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<ResultatPage<TypeCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<TypeCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
