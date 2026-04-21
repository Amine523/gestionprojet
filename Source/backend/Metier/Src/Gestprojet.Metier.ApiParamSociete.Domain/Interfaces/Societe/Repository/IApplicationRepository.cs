using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IApplicationRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(ApplicationCore entity);
        Task<ApplicationCore> ObtenirAsync(string id);
        Task<IEnumerable<ApplicationCore>> ListeAsync();
        Task<IEnumerable<ApplicationCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<ApplicationDetailles>> ListeDetailleAsync();
        Task<IEnumerable<ApplicationDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<ApplicationCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ApplicationCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<ApplicationDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ApplicationDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
