using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IRoleCoreBusiness
    {
        Task<bool> AjouterRoleAsync(RoleCore roleCore);
        Task<bool> ModifierRoleAsync(RoleCore roleCore);
        Task<bool> SupprimerRoleAsync(string id);
        Task<bool> SupprimerRoleParConditionAsync(CritereRecherche critereRecherche);
        Task<RoleCore> ObtenirRoleParIdAsync(string id);
        Task<List<RoleCore>> ListeRoleAsync();
        Task<List<RoleCore>> ListeRoleParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<RoleCore>> ListeRoleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<RoleCore>> ListeRoleParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
