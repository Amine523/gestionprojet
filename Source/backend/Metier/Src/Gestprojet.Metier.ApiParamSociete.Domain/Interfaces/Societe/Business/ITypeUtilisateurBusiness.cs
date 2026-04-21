using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface ITypeUtilisateurBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(TypeUtilisateurCore entity);
        Task<TypeUtilisateurCore> ObtenirAsync(string id);
        Task<IEnumerable<TypeUtilisateurCore>> ListeAsync();
        Task<IEnumerable<TypeUtilisateurCore>> ListeParCritereAsync(ConditionRecherche critere);
        Task<OperationResult> SupprimerAsync(string id);
        Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere);
        Task<ResultatPage<TypeUtilisateurCore>> ListeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeUtilisateurCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille);
    }
}
