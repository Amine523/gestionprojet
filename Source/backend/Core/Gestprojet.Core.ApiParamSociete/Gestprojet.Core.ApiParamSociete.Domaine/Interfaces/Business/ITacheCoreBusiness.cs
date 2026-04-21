using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ITacheCoreBusiness
    {
        Task<bool> AjouterTacheAsync(TacheCore tacheCore);
        Task<bool> ModifierTacheAsync(TacheCore tacheCore);
        Task<bool> SupprimerTacheAsync(string id);
        Task<bool> SupprimerTacheParConditionAsync(CritereRecherche critereRecherche);
        Task<TacheCore> ObtenirTacheParIdAsync(string id);
        Task<List<TacheCore>> ListeTacheAsync();
        Task<List<TacheCore>> ListeTacheParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TacheCore>> ListeTacheParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheCore>> ListeTacheParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}

