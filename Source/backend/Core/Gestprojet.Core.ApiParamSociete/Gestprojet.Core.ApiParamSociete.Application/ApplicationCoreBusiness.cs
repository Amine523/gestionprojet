using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class ApplicationCoreBusiness : IApplicationCoreBusiness
    {
        private readonly IApplicationCoreRepository _applicationCoreRepository;

        public ApplicationCoreBusiness(IApplicationCoreRepository applicationCoreRepository)
        {
            _applicationCoreRepository = applicationCoreRepository;
        }

        public async Task<bool> AjouterApplicationAsync(ApplicationCore applicationCore)
            => await _applicationCoreRepository.AjouterApplicationCoreAsync(applicationCore);

        public async Task<bool> ModifierApplicationAsync(ApplicationCore applicationCore)
            => await _applicationCoreRepository.ModifierApplicationCoreAsync(applicationCore);

        public async Task<bool> SupprimerApplicationAsync(string id)
            => await _applicationCoreRepository.SupprimerApplicationCoreAsync(id);

        public async Task<bool> SupprimerApplicationParConditionAsync(CritereRecherche critereRecherche)
            => await _applicationCoreRepository.SupprimerApplicationCoreParConditionAsync(critereRecherche);

        public async Task<ApplicationCore> ObtenirApplicationParIdAsync(string id)
            => await _applicationCoreRepository.ObtenirApplicationCoreParIdAsync(id);

        public async Task<List<ApplicationCore>> ListeApplicationAsync()
            => await _applicationCoreRepository.ListeApplicationCoreAsync();

        public async Task<List<ApplicationCore>> ListeApplicationParConditionAsync(CritereRecherche critereRecherche)
            => await _applicationCoreRepository.ListeApplicationCoreParConditionAsync(critereRecherche);

        public async Task<ResultatPage<ApplicationCore>> ListeApplicationParPageAsync(int pageNumero, int pageTaille)
            => await _applicationCoreRepository.ListeApplicationCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<ApplicationCore>> ListeApplicationParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
            => await _applicationCoreRepository.ListeApplicationCoreParConditionParPageAsync(critereRecherche, pageNumero, pageTaille);
    }
}
