using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface ISousTacheCoreRepository
    {
        Task<bool> AjouterSousTacheCoreAsync(SousTacheCore sousTacheCore);
        Task<bool> ModifierSousTacheCoreAsync(SousTacheCore sousTacheCore);
        Task<bool> SupprimerSousTacheCoreAsync(string id);
        Task<bool> SupprimerSousTacheCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<SousTacheCore> ObtenirSousTacheCoreParIdAsync(string id);
        Task<List<SousTacheCore>> ListeSousTacheCoreAsync();
        Task<List<SousTacheCore>> ListeSousTacheCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<SousTacheCore>> ListeSousTacheCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SousTacheCore>> ListeSousTacheCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}