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
    public class RoleBusiness : IRoleBusiness
    {
        private readonly IRoleRepository _repository;

        public RoleBusiness(IRoleRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(RoleCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<RoleCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<RoleCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<RoleCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<ResultatPage<RoleCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<RoleCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
