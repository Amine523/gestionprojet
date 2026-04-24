using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IAttachementRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(AttachementCore entity);
        Task<AttachementCore?> ObtenirAsync(string id);
        Task<IEnumerable<AttachementCore>> ListeAsync();
        Task<IEnumerable<AttachementCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<AttachementDetailles>> ListeDetailleAsync();
        Task<IEnumerable<AttachementDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<AttachementCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<AttachementCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<AttachementDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<AttachementDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
