using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface ISousTacheBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(SousTacheCore entity);
        Task<SousTacheCore> ObtenirAsync(string id);
        Task<IEnumerable<SousTacheCore>> ListeAsync();
        Task<IEnumerable<SousTacheCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<SousTacheDetailles>> ListeDetailleAsync();
        Task<IEnumerable<SousTacheDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<SousTacheCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SousTacheCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<SousTacheDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SousTacheDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
