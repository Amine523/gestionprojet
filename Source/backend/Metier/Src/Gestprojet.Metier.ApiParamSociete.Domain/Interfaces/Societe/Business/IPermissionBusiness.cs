using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface IPermissionBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(PermissionCore entity);
        Task<PermissionCore> ObtenirAsync(string id);
        Task<IEnumerable<PermissionCore>> ListeAsync();
        Task<IEnumerable<PermissionCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<PermissionDetailles>> ListeDetailleAsync();
        Task<IEnumerable<PermissionDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<PermissionCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PermissionCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<PermissionDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PermissionDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
