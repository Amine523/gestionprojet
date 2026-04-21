using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ITypeUtilisateurCoreBusiness
    {
        Task<bool> AjouterTypeUtilisateurAsync(TypeUtilisateurCore typeUtilisateurCore);
        Task<bool> ModifierTypeUtilisateurAsync(TypeUtilisateurCore typeUtilisateurCore);
        Task<bool> SupprimerTypeUtilisateurAsync(string id);
        Task<bool> SupprimerTypeUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<TypeUtilisateurCore> ObtenirTypeUtilisateurParIdAsync(string id);
        Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurAsync();
        Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
