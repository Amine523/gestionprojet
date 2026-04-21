using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class PermissionCoreBusiness : IPermissionCoreBusiness
    {
        private readonly IPermissionCoreRepository _repository;

        public PermissionCoreBusiness(IPermissionCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterPermissionAsync(PermissionCore entity)
            => await _repository.AjouterPermissionCoreAsync(entity);

        public async Task<bool> ModifierPermissionAsync(PermissionCore entity)
            => await _repository.ModifierPermissionCoreAsync(entity);

        public async Task<bool> SupprimerPermissionAsync(string id)
            => await _repository.SupprimerPermissionCoreAsync(id);

        public async Task<bool> SupprimerPermissionParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerPermissionCoreParConditionAsync(critere);

        public async Task<PermissionCore> ObtenirPermissionParIdAsync(string id)
            => await _repository.ObtenirPermissionCoreParIdAsync(id);

        public async Task<List<PermissionCore>> ListePermissionAsync()
            => await _repository.ListePermissionCoreAsync();

        public async Task<List<PermissionCore>> ListePermissionParConditionAsync(CritereRecherche critere)
            => await _repository.ListePermissionCoreParConditionAsync(critere);

        public async Task<ResultatPage<PermissionCore>> ListePermissionParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListePermissionCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<PermissionCore>> ListePermissionParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListePermissionCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}