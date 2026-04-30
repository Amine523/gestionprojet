using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class DemandeLogCoreBusiness : IDemandeLogCoreBusiness
    {
        private readonly IDemandeLogCoreRepository _repository;

        public DemandeLogCoreBusiness(IDemandeLogCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterDemandeLogCoreAsync(DemandeLogCore demandeLogCore)
        {
            if (string.IsNullOrEmpty(demandeLogCore.Id))
                demandeLogCore.Id = Guid.NewGuid().ToString();
            
            if (demandeLogCore.DateCreation == default)
                demandeLogCore.DateCreation = DateTime.Now;

            return await _repository.AjouterDemandeLogCoreAsync(demandeLogCore);
        }

        public async Task<List<DemandeLogCore>> ListeDemandeLogCoreAsync()
        {
            return await _repository.ListeDemandeLogCoreAsync();
        }

        public async Task<List<DemandeLogCore>> ListeDemandeLogCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            return await _repository.ListeDemandeLogCoreParConditionAsync(critereRecherche);
        }

        public async Task<ResultatPage<DemandeLogCore>> ListeDemandeLogCoreParPageAsync(int pageNumero, int pageTaille)
        {
            return await _repository.ListeDemandeLogCoreParPageAsync(pageNumero, pageTaille);
        }
    }
}
