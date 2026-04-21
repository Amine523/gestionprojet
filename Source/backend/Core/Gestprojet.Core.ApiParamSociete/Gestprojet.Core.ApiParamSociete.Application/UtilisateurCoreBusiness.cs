using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class UtilisateurCoreBusiness : IUtilisateurCoreBusiness
    {
        private readonly IUtilisateurCoreRepository _repository;

        public UtilisateurCoreBusiness(IUtilisateurCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterUtilisateurAsync(UtilisateurCore entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
            {
                entity.Id = $"U{DateTime.Now:yyyyMMddHHmmssfff}";
            }
            if (string.IsNullOrEmpty(entity.MotDePasse))
            {
                entity.MotDePasse = "Default123!";
            }
            return await _repository.AjouterUtilisateurCoreAsync(entity);
        }

        public async Task<bool> ModifierUtilisateurAsync(UtilisateurCore entity)
            => await _repository.ModifierUtilisateurCoreAsync(entity);

        public async Task<bool> SupprimerUtilisateurAsync(string id)
            => await _repository.SupprimerUtilisateurCoreAsync(id);

        public async Task<bool> SupprimerUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerUtilisateurCoreParConditionAsync(critere);

        public async Task<UtilisateurCore> ObtenirUtilisateurParIdAsync(string id)
            => await _repository.ObtenirUtilisateurCoreParIdAsync(id);

        public async Task<UtilisateurCore> ObtenirUtilisateurParEmailAsync(string email)
            => await _repository.ObtenirUtilisateurCoreParEmailAsync(email);

        public async Task<List<UtilisateurCore>> ListeUtilisateurAsync()
            => await _repository.ListeUtilisateurCoreAsync();

        public async Task<List<UtilisateurCore>> ListeUtilisateurParConditionAsync(CritereRecherche critere)
            => await _repository.ListeUtilisateurCoreParConditionAsync(critere);

        public async Task<ResultatPage<UtilisateurCore>> ListeUtilisateurParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeUtilisateurCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<UtilisateurCore>> ListeUtilisateurParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeUtilisateurCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}