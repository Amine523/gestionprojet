using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ISousTacheCoreBusiness
    {
        Task<bool> AjouterSousTacheAsync(SousTacheCore sousTacheCore);
        Task<bool> ModifierSousTacheAsync(SousTacheCore sousTacheCore);
        Task<bool> SupprimerSousTacheAsync(string id);
        Task<bool> SupprimerSousTacheParConditionAsync(CritereRecherche critereRecherche);
        Task<SousTacheCore> ObtenirSousTacheParIdAsync(string id);
        Task<List<SousTacheCore>> ListeSousTacheAsync();
        Task<List<SousTacheCore>> ListeSousTacheParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<SousTacheCore>> ListeSousTacheParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SousTacheCore>> ListeSousTacheParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
