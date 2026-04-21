using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IRoleRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(RoleCore entity);
        Task<RoleCore> ObtenirAsync(string id);
        Task<IEnumerable<RoleCore>> ListeAsync();
        Task<IEnumerable<RoleCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<RoleCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<RoleCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
