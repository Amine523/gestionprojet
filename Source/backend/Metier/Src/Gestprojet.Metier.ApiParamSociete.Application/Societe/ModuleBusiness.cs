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
    public class ModuleBusiness : IModuleBusiness
    {
        private readonly IModuleRepository _repository;

        public ModuleBusiness(IModuleRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(ModuleCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<ModuleCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<ModuleCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<ModuleCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<ResultatPage<ModuleCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<ModuleCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
