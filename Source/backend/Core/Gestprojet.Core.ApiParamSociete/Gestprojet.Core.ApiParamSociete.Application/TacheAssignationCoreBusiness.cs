using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class TacheAssignationCoreBusiness : ITacheAssignationCoreBusiness
    {
        private readonly ITacheAssignationCoreRepository _repository;

        public TacheAssignationCoreBusiness(ITacheAssignationCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterTacheAssignationAsync(TacheAssignationCore entity)
            => await _repository.AjouterTacheAssignationCoreAsync(entity);

        public async Task<bool> ModifierTacheAssignationAsync(TacheAssignationCore entity)
            => await _repository.ModifierTacheAssignationCoreAsync(entity);

        public async Task<bool> SupprimerTacheAssignationAsync(string id)
            => await _repository.SupprimerTacheAssignationCoreAsync(id);

        public async Task<bool> SupprimerTacheAssignationParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerTacheAssignationCoreParConditionAsync(critere);

        public async Task<TacheAssignationCore> ObtenirTacheAssignationParIdAsync(string id)
            => await _repository.ObtenirTacheAssignationCoreParIdAsync(id);

        public async Task<List<TacheAssignationCore>> ListeTacheAssignationAsync()
            => await _repository.ListeTacheAssignationCoreAsync();

        public async Task<List<TacheAssignationCore>> ListeTacheAssignationParConditionAsync(CritereRecherche critere)
            => await _repository.ListeTacheAssignationCoreParConditionAsync(critere);

        public async Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeTacheAssignationCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeTacheAssignationCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}