using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IRoleCoreRepository
    {
        Task<bool> AjouterRoleCoreAsync(RoleCore roleCore);
        Task<bool> ModifierRoleCoreAsync(RoleCore roleCore);
        Task<bool> SupprimerRoleCoreAsync(string id);
        Task<bool> SupprimerRoleCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<RoleCore> ObtenirRoleCoreParIdAsync(string id);
        Task<List<RoleCore>> ListeRoleCoreAsync();
        Task<List<RoleCore>> ListeRoleCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<RoleCore>> ListeRoleCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<RoleCore>> ListeRoleCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}