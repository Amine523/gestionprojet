using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IApplicationCoreRepository
    {
        Task<bool> AjouterApplicationCoreAsync(ApplicationCore applicationCore);
        Task<bool> ModifierApplicationCoreAsync(ApplicationCore applicationCore);
        Task<bool> SupprimerApplicationCoreAsync(string id);
        Task<bool> SupprimerApplicationCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ApplicationCore> ObtenirApplicationCoreParIdAsync(string id);
        Task<List<ApplicationCore>> ListeApplicationCoreAsync();
        Task<List<ApplicationCore>> ListeApplicationCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ApplicationCore>> ListeApplicationCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ApplicationCore>> ListeApplicationCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}