using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface ITypeBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(TypeCore entity);
        Task<TypeCore> ObtenirAsync(string id);
        Task<IEnumerable<TypeCore>> ListeAsync();
        Task<IEnumerable<TypeCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<TypeCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
