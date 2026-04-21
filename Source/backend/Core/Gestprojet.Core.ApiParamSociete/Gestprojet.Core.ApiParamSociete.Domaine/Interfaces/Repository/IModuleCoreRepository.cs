using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IModuleCoreRepository
    {
        Task<bool> AjouterModuleCoreAsync(ModuleCore moduleCore);
        Task<bool> ModifierModuleCoreAsync(ModuleCore moduleCore);
        Task<bool> SupprimerModuleCoreAsync(string id);
        Task<bool> SupprimerModuleCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ModuleCore> ObtenirModuleCoreParIdAsync(string id);
        Task<List<ModuleCore>> ListeModuleCoreAsync();
        Task<List<ModuleCore>> ListeModuleCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ModuleCore>> ListeModuleCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ModuleCore>> ListeModuleCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}