using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IProjetUtilisateurRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(ProjetUtilisateurCore entity);
        Task<ProjetUtilisateurCore?> ObtenirAsync(string id);
        Task<IEnumerable<ProjetUtilisateurCore>> ListeAsync();
        Task<IEnumerable<ProjetUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleAsync();
        Task<IEnumerable<ProjetUtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetUtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
