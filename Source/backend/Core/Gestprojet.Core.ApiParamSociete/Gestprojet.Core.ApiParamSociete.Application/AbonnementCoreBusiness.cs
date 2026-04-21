using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class AbonnementCoreBusiness : IAbonnementCoreBusiness
    {
        private readonly IAbonnementCoreRepository _repo;
        public AbonnementCoreBusiness(IAbonnementCoreRepository repo) => _repo = repo;

        public Task<bool> AjouterAbonnementCoreAsync(AbonnementCore entity) => _repo.AjouterAbonnementCoreAsync(entity);
        public Task<bool> ModifierAbonnementCoreAsync(AbonnementCore entity) => _repo.ModifierAbonnementCoreAsync(entity);
        public Task<bool> SupprimerAbonnementCoreAsync(string id) => _repo.SupprimerAbonnementCoreAsync(id);
        public Task<bool> SupprimerAbonnementCoreParConditionAsync(CritereRecherche critere) => _repo.SupprimerAbonnementCoreParConditionAsync(critere);
        public Task<AbonnementCore> ObtenirAbonnementCoreParIdAsync(string id) => _repo.ObtenirAbonnementCoreParIdAsync(id);
        public Task<List<AbonnementCore>> ListeAbonnementCoreAsync() => _repo.ListeAbonnementCoreAsync();
        public Task<List<AbonnementCore>> ListeAbonnementCoreParConditionAsync(CritereRecherche critere) => _repo.ListeAbonnementCoreParConditionAsync(critere);
        public Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParPageAsync(int num, int size) => _repo.ListeAbonnementCoreParPageAsync(num, size);
        public Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParConditionParPageAsync(CritereRecherche critere, int num, int size) => _repo.ListeAbonnementCoreParConditionParPageAsync(critere, num, size);
    }
}
