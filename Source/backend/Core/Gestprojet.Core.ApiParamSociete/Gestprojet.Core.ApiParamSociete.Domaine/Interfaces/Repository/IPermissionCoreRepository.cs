using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IPermissionCoreRepository
    {
        Task<bool> AjouterPermissionCoreAsync(PermissionCore permissionCore);
        Task<bool> ModifierPermissionCoreAsync(PermissionCore permissionCore);
        Task<bool> SupprimerPermissionCoreAsync(string id);
        Task<bool> SupprimerPermissionCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<PermissionCore> ObtenirPermissionCoreParIdAsync(string id);
        Task<List<PermissionCore>> ListePermissionCoreAsync();
        Task<List<PermissionCore>> ListePermissionCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<PermissionCore>> ListePermissionCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PermissionCore>> ListePermissionCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}