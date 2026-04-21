using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class ProjetUtilisateurCoreBusiness : IProjetUtilisateurCoreBusiness
    {
        private readonly IProjetUtilisateurCoreRepository _repository;

        public ProjetUtilisateurCoreBusiness(IProjetUtilisateurCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterProjetUtilisateurAsync(ProjetUtilisateurCore entity)
            => await _repository.AjouterProjetUtilisateurCoreAsync(entity);

        public async Task<bool> ModifierProjetUtilisateurAsync(ProjetUtilisateurCore entity)
            => await _repository.ModifierProjetUtilisateurCoreAsync(entity);

        public async Task<bool> SupprimerProjetUtilisateurAsync(string id)
            => await _repository.SupprimerProjetUtilisateurCoreAsync(id);

        public async Task<bool> SupprimerProjetUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerProjetUtilisateurCoreParConditionAsync(critere);

        public async Task<ProjetUtilisateurCore> ObtenirProjetUtilisateurParIdAsync(string id)
            => await _repository.ObtenirProjetUtilisateurCoreParIdAsync(id);

        public async Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurAsync()
            => await _repository.ListeProjetUtilisateurCoreAsync();

        public async Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.ListeProjetUtilisateurCoreParConditionAsync(critere);

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeProjetUtilisateurCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeProjetUtilisateurCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}