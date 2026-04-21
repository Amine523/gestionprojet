using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class TypeUtilisateurCoreBusiness : ITypeUtilisateurCoreBusiness
    {
        private readonly ITypeUtilisateurCoreRepository _repository;

        public TypeUtilisateurCoreBusiness(ITypeUtilisateurCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterTypeUtilisateurAsync(TypeUtilisateurCore entity)
            => await _repository.AjouterTypeUtilisateurCoreAsync(entity);

        public async Task<bool> ModifierTypeUtilisateurAsync(TypeUtilisateurCore entity)
            => await _repository.ModifierTypeUtilisateurCoreAsync(entity);

        public async Task<bool> SupprimerTypeUtilisateurAsync(string id)
            => await _repository.SupprimerTypeUtilisateurCoreAsync(id);

        public async Task<bool> SupprimerTypeUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerTypeUtilisateurCoreParConditionAsync(critere);

        public async Task<TypeUtilisateurCore> ObtenirTypeUtilisateurParIdAsync(string id)
            => await _repository.ObtenirTypeUtilisateurCoreParIdAsync(id);

        public async Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurAsync()
            => await _repository.ListeTypeUtilisateurCoreAsync();

        public async Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.ListeTypeUtilisateurCoreParConditionAsync(critere);

        public async Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeTypeUtilisateurCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeTypeUtilisateurCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}