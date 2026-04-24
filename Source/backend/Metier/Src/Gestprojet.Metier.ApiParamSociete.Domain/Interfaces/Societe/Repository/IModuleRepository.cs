using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IModuleRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(ModuleCore entity);
        Task<ModuleCore?> ObtenirAsync(string id);
        Task<IEnumerable<ModuleCore>> ListeAsync();
        Task<IEnumerable<ModuleCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<ModuleCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ModuleCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
