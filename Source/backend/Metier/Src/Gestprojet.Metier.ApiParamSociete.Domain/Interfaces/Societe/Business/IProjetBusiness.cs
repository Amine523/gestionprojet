using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface IProjetBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(ProjetCore entity);
        Task<ProjetCore> ObtenirAsync(string id);
        Task<IEnumerable<ProjetCore>> ListeAsync();
        Task<IEnumerable<ProjetCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<ProjetDetailles>> ListeDetailleAsync();
        Task<IEnumerable<ProjetDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<ProjetCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<IEnumerable<ProjetCore>> ListeParSocieteAsync(string societeId);
    }
}
