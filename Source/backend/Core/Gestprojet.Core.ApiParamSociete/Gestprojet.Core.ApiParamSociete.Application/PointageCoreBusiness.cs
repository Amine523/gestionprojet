using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class PointageCoreBusiness : IPointageCoreBusiness
    {
        private readonly IPointageCoreRepository _repository;

        public PointageCoreBusiness(IPointageCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterPointageAsync(PointageCore entity)
            => await _repository.AjouterPointageCoreAsync(entity);

        public async Task<bool> ModifierPointageAsync(PointageCore entity)
            => await _repository.ModifierPointageCoreAsync(entity);

        public async Task<bool> SupprimerPointageAsync(string id)
            => await _repository.SupprimerPointageCoreAsync(id);

        public async Task<bool> SupprimerPointageParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerPointageCoreParConditionAsync(critere);

        public async Task<PointageCore> ObtenirPointageParIdAsync(string id)
            => await _repository.ObtenirPointageCoreParIdAsync(id);

        public async Task<List<PointageCore>> ListePointageAsync()
            => await _repository.ListePointageCoreAsync();

        public async Task<List<PointageCore>> ListePointageParConditionAsync(CritereRecherche critere)
            => await _repository.ListePointageCoreParConditionAsync(critere);

        public async Task<ResultatPage<PointageCore>> ListePointageParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListePointageCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<PointageCore>> ListePointageParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListePointageCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}