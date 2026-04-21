using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class SousTacheCoreBusiness : ISousTacheCoreBusiness
    {
        private readonly ISousTacheCoreRepository _repository;

        public SousTacheCoreBusiness(ISousTacheCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterSousTacheAsync(SousTacheCore entity)
            => await _repository.AjouterSousTacheCoreAsync(entity);

        public async Task<bool> ModifierSousTacheAsync(SousTacheCore entity)
            => await _repository.ModifierSousTacheCoreAsync(entity);

        public async Task<bool> SupprimerSousTacheAsync(string id)
            => await _repository.SupprimerSousTacheCoreAsync(id);

        public async Task<bool> SupprimerSousTacheParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerSousTacheCoreParConditionAsync(critere);

        public async Task<SousTacheCore> ObtenirSousTacheParIdAsync(string id)
            => await _repository.ObtenirSousTacheCoreParIdAsync(id);

        public async Task<List<SousTacheCore>> ListeSousTacheAsync()
            => await _repository.ListeSousTacheCoreAsync();

        public async Task<List<SousTacheCore>> ListeSousTacheParConditionAsync(CritereRecherche critere)
            => await _repository.ListeSousTacheCoreParConditionAsync(critere);

        public async Task<ResultatPage<SousTacheCore>> ListeSousTacheParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeSousTacheCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<SousTacheCore>> ListeSousTacheParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeSousTacheCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}