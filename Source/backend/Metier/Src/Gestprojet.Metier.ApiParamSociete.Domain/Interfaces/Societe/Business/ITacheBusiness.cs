using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface ITacheBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(TacheCore entity);
        Task<TacheCore> ObtenirAsync(string id);
        Task<IEnumerable<TacheCore>> ListeAsync();
        Task<IEnumerable<TacheCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<TacheDetailles>> ListeDetailleAsync();
        Task<IEnumerable<TacheDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<TacheCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<TacheDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
