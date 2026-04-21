using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface ITacheCoreRepository
    {
        Task<bool> AjouterTacheCoreAsync(TacheCore tacheCore);
        Task<bool> ModifierTacheCoreAsync(TacheCore tacheCore);
        Task<bool> SupprimerTacheCoreAsync(string id);
        Task<bool> SupprimerTacheCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<TacheCore> ObtenirTacheCoreParIdAsync(string id);
        Task<List<TacheCore>> ListeTacheCoreAsync();
        Task<List<TacheCore>> ListeTacheCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TacheCore>> ListeTacheCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheCore>> ListeTacheCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}