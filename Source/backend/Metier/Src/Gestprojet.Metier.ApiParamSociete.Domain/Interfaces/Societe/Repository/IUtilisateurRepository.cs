using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IUtilisateurRepository
    {
        Task<OperationResult> AjouterOuModifierAsync(UtilisateurCore entity);
        Task<UtilisateurCore> ObtenirAsync(string id);
        Task<IEnumerable<UtilisateurCore>> ListeAsync();
        Task<IEnumerable<UtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<IEnumerable<UtilisateurDetailles>> ListeDetailleAsync();
        Task<IEnumerable<UtilisateurDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<UtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<UtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<UtilisateurDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
        Task<OperationResult> ModifierMotDePasseConnecteAsync(string id, string ancienMotDePasse, string nouveauMotDePasse);
        Task<OperationResult> ModifierMotDePasseHorsLigneAsync(string email, string nouveauMotDePasse);
    }
}
