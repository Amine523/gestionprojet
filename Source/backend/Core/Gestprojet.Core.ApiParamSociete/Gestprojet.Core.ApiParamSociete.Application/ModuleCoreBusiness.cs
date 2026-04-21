using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class ModuleCoreBusiness : IModuleCoreBusiness
    {
        private readonly IModuleCoreRepository _repository;

        public ModuleCoreBusiness(IModuleCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterModuleAsync(ModuleCore entity)
            => await _repository.AjouterModuleCoreAsync(entity);

        public async Task<bool> ModifierModuleAsync(ModuleCore entity)
            => await _repository.ModifierModuleCoreAsync(entity);

        public async Task<bool> SupprimerModuleAsync(string id)
            => await _repository.SupprimerModuleCoreAsync(id);

        public async Task<bool> SupprimerModuleParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerModuleCoreParConditionAsync(critere);

        public async Task<ModuleCore> ObtenirModuleParIdAsync(string id)
            => await _repository.ObtenirModuleCoreParIdAsync(id);

        public async Task<List<ModuleCore>> ListeModuleAsync()
            => await _repository.ListeModuleCoreAsync();

        public async Task<List<ModuleCore>> ListeModuleParConditionAsync(CritereRecherche critere)
            => await _repository.ListeModuleCoreParConditionAsync(critere);

        public async Task<ResultatPage<ModuleCore>> ListeModuleParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeModuleCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<ModuleCore>> ListeModuleParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeModuleCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}