using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class TypeCoreBusiness : ITypeCoreBusiness
    {
        private readonly ITypeCoreRepository _repository;

        public TypeCoreBusiness(ITypeCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterTypeAsync(TypeCore entity)
            => await _repository.AjouterTypeCoreAsync(entity);

        public async Task<bool> ModifierTypeAsync(TypeCore entity)
            => await _repository.ModifierTypeCoreAsync(entity);

        public async Task<bool> SupprimerTypeAsync(string id)
            => await _repository.SupprimerTypeCoreAsync(id);

        public async Task<bool> SupprimerTypeParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerTypeCoreParConditionAsync(critere);

        public async Task<TypeCore> ObtenirTypeParIdAsync(string id)
            => await _repository.ObtenirTypeCoreParIdAsync(id);

        public async Task<List<TypeCore>> ListeTypeAsync()
            => await _repository.ListeTypeCoreAsync();

        public async Task<List<TypeCore>> ListeTypeParConditionAsync(CritereRecherche critere)
            => await _repository.ListeTypeCoreParConditionAsync(critere);

        public async Task<ResultatPage<TypeCore>> ListeTypeParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeTypeCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<TypeCore>> ListeTypeParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeTypeCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}