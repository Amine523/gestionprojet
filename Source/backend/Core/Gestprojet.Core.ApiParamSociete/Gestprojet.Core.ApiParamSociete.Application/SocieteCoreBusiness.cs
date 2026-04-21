using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class SocieteCoreBusiness : ISocieteCoreBusiness
    {
        private readonly ISocieteCoreRepository _societeCoreRepository;

        public SocieteCoreBusiness(ISocieteCoreRepository societeCoreRepository)
        {
            _societeCoreRepository = societeCoreRepository;
        }

        public async Task<bool> AjouterSocieteAsync(SocieteCore societe)
        {
            if (string.IsNullOrEmpty(societe.Id))
            {
                societe.Id = $"SOC{DateTime.Now:yyyyMMddHHmmssfff}";
            }
            return await _societeCoreRepository.AjouterSocieteCoreAsync(societe);
        }

        public async Task<bool> ModifierSocieteAsync(SocieteCore societe)
            => await _societeCoreRepository.ModifierSocieteCoreAsync(societe);

        public async Task<bool> SupprimerSocieteAsync(string id)
            => await _societeCoreRepository.SupprimerSocieteCoreAsync(id);

        public async Task<bool> SupprimerSocieteParConditionAsync(CritereRecherche critereRecherche)
            => await _societeCoreRepository.SupprimerSocieteCoreParConditionAsync(critereRecherche);

        public async Task<SocieteCore> ObtenirSocieteParIdAsync(string id)
            => await _societeCoreRepository.ObtenirSocieteCoreParIdAsync(id);

        public async Task<List<SocieteCore>> ListeSocieteAsync()
            => await _societeCoreRepository.ListeSocieteCoreAsync();

        public async Task<List<SocieteCore>> ListeSocieteParConditionAsync(CritereRecherche critereRecherche)
            => await _societeCoreRepository.ListeSocieteCoreParConditionAsync(critereRecherche);

        public async Task<ResultatPage<SocieteCore>> ListeSocieteParPageAsync(int pageNumero, int pageTaille)
            => await _societeCoreRepository.ListeSocieteCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<SocieteCore>> ListeSocieteParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
            => await _societeCoreRepository.ListeSocieteCoreParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
    }
}