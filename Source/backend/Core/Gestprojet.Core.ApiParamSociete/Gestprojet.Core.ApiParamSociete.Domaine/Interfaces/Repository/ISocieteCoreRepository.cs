using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{ 
    public interface ISocieteCoreRepository
    {
        Task<bool> AjouterSocieteCoreAsync(SocieteCore societeCore);
        Task<bool> ModifierSocieteCoreAsync(SocieteCore societeCore);
        Task<bool> SupprimerSocieteCoreAsync(string id);
        Task<bool> SupprimerSocieteCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<SocieteCore> ObtenirSocieteCoreParIdAsync(string id);
        Task<List<SocieteCore>> ListeSocieteCoreAsync();
        Task<List<SocieteCore>> ListeSocieteCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<SocieteCore>> ListeSocieteCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SocieteCore>> ListeSocieteCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
