using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IAbonnementCoreBusiness
    {
        Task<bool> AjouterAbonnementCoreAsync(AbonnementCore AbonnementCore);
        Task<bool> ModifierAbonnementCoreAsync(AbonnementCore AbonnementCore);
        Task<bool> SupprimerAbonnementCoreAsync(string id);
        Task<bool> SupprimerAbonnementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<AbonnementCore> ObtenirAbonnementCoreParIdAsync(string id);
        Task<List<AbonnementCore>> ListeAbonnementCoreAsync();
        Task<List<AbonnementCore>> ListeAbonnementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
