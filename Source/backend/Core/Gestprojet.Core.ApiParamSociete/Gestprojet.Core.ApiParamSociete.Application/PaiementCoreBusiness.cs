using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class PaiementCoreBusiness : IPaiementCoreBusiness
    {
        private readonly IPaiementCoreRepository _repo;
        public PaiementCoreBusiness(IPaiementCoreRepository repo) => _repo = repo;

        public Task<bool> AjouterPaiementCoreAsync(PaiementCore entity) => _repo.AjouterPaiementCoreAsync(entity);
        public Task<bool> ModifierPaiementCoreAsync(PaiementCore entity) => _repo.ModifierPaiementCoreAsync(entity);
        public Task<bool> SupprimerPaiementCoreAsync(string id) => _repo.SupprimerPaiementCoreAsync(id);
        public Task<PaiementCore> ObtenirPaiementCoreParIdAsync(string id) => _repo.ObtenirPaiementCoreParIdAsync(id);
        public Task<List<PaiementCore>> ListePaiementCoreAsync() => _repo.ListePaiementCoreAsync();
        public Task<List<PaiementCore>> ListePaiementCoreParConditionAsync(CritereRecherche critere) => _repo.ListePaiementCoreParConditionAsync(critere);
        public Task<ResultatPage<PaiementCore>> ListePaiementCoreParPageAsync(int pageNumero, int pageTaille) => _repo.ListePaiementCoreParPageAsync(pageNumero, pageTaille);
    }
}
