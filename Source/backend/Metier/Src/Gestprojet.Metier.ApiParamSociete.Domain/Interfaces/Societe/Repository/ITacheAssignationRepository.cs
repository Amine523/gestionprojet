using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface ITacheAssignationRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(TacheAssignationCore entity);
        Task<TacheAssignationCore?> ObtenirAsync(string id);
        Task<IEnumerable<TacheAssignationCore>> ListeAsync();
        Task<IEnumerable<TacheAssignationCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleAsync();
        Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<TacheAssignationCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheAssignationCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
