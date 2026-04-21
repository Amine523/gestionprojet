using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IPointageRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(PointageCore entity);
        Task<PointageCore> ObtenirAsync(string id);
        Task<IEnumerable<PointageCore>> ListeAsync();
        Task<IEnumerable<PointageCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<PointageDetailles>> ListeDetailleAsync();
        Task<IEnumerable<PointageDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<PointageCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PointageCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<PointageDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PointageDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
