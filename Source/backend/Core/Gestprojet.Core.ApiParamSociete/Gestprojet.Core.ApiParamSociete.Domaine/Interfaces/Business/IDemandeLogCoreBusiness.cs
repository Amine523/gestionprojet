using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IDemandeLogCoreBusiness
    {
        Task<bool> AjouterDemandeLogCoreAsync(DemandeLogCore demandeLogCore);
        Task<List<DemandeLogCore>> ListeDemandeLogCoreAsync();
        Task<List<DemandeLogCore>> ListeDemandeLogCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<DemandeLogCore>> ListeDemandeLogCoreParPageAsync(int pageNumero, int pageTaille);
    }
}
