using Gestprojet.Core.ApiParamSociete.Domain.Models;

using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IPermissionCoreBusiness
    {
        Task<bool> AjouterPermissionAsync(PermissionCore permissionCore);
        Task<bool> ModifierPermissionAsync(PermissionCore permissionCore);
        Task<bool> SupprimerPermissionAsync(string id);
        Task<bool> SupprimerPermissionParConditionAsync(CritereRecherche critereRecherche);
        Task<PermissionCore> ObtenirPermissionParIdAsync(string id);
        Task<List<PermissionCore>> ListePermissionAsync();
        Task<List<PermissionCore>> ListePermissionParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<PermissionCore>> ListePermissionParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PermissionCore>> ListePermissionParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}