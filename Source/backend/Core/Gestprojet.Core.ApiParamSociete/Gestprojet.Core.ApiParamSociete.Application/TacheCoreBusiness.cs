using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class TacheCoreBusiness : ITacheCoreBusiness
    {
        private readonly ITacheCoreRepository _repository;

        public TacheCoreBusiness(ITacheCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterTacheAsync(TacheCore entity)
            => await _repository.AjouterTacheCoreAsync(entity);

        public async Task<bool> ModifierTacheAsync(TacheCore entity)
            => await _repository.ModifierTacheCoreAsync(entity);

        public async Task<bool> SupprimerTacheAsync(string id)
            => await _repository.SupprimerTacheCoreAsync(id);

        public async Task<bool> SupprimerTacheParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerTacheCoreParConditionAsync(critere);

        public async Task<TacheCore> ObtenirTacheParIdAsync(string id)
            => await _repository.ObtenirTacheCoreParIdAsync(id);

        public async Task<List<TacheCore>> ListeTacheAsync()
            => await _repository.ListeTacheCoreAsync();

        public async Task<List<TacheCore>> ListeTacheParConditionAsync(CritereRecherche critere)
            => await _repository.ListeTacheCoreParConditionAsync(critere);

        public async Task<ResultatPage<TacheCore>> ListeTacheParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeTacheCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<TacheCore>> ListeTacheParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeTacheCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}