using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class RoleCoreBusiness : IRoleCoreBusiness
    {
        private readonly IRoleCoreRepository _repository;

        public RoleCoreBusiness(IRoleCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterRoleAsync(RoleCore entity)
            => await _repository.AjouterRoleCoreAsync(entity);

        public async Task<bool> ModifierRoleAsync(RoleCore entity)
            => await _repository.ModifierRoleCoreAsync(entity);

        public async Task<bool> SupprimerRoleAsync(string id)
            => await _repository.SupprimerRoleCoreAsync(id);

        public async Task<bool> SupprimerRoleParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerRoleCoreParConditionAsync(critere);

        public async Task<RoleCore> ObtenirRoleParIdAsync(string id)
            => await _repository.ObtenirRoleCoreParIdAsync(id);

        public async Task<List<RoleCore>> ListeRoleAsync()
            => await _repository.ListeRoleCoreAsync();

        public async Task<List<RoleCore>> ListeRoleParConditionAsync(CritereRecherche critere)
            => await _repository.ListeRoleCoreParConditionAsync(critere);

        public async Task<ResultatPage<RoleCore>> ListeRoleParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeRoleCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<RoleCore>> ListeRoleParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeRoleCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}