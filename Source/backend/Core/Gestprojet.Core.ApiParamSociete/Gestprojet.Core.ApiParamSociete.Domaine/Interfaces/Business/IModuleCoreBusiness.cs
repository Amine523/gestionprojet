using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IModuleCoreBusiness
    {
        Task<bool> AjouterModuleAsync(ModuleCore moduleCore);
        Task<bool> ModifierModuleAsync(ModuleCore moduleCore);
        Task<bool> SupprimerModuleAsync(string id);
        Task<bool> SupprimerModuleParConditionAsync(CritereRecherche critereRecherche);
        Task<ModuleCore> ObtenirModuleParIdAsync(string id);
        Task<List<ModuleCore>> ListeModuleAsync();
        Task<List<ModuleCore>> ListeModuleParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ModuleCore>> ListeModuleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ModuleCore>> ListeModuleParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}