using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface ISocieteRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(SocieteCore entity);
        Task<SocieteCore> ObtenirAsync(string id);
        Task<IEnumerable<SocieteCore>> ListeAsync();
        Task<IEnumerable<SocieteCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<SocieteCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SocieteCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
