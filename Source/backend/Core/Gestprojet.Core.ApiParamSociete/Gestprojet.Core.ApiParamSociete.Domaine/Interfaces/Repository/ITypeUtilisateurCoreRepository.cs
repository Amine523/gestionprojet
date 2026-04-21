using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface ITypeUtilisateurCoreRepository
    {
        Task<bool> AjouterTypeUtilisateurCoreAsync(TypeUtilisateurCore typeUtilisateurCore);
        Task<bool> ModifierTypeUtilisateurCoreAsync(TypeUtilisateurCore typeUtilisateurCore);
        Task<bool> SupprimerTypeUtilisateurCoreAsync(string id);
        Task<bool> SupprimerTypeUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<TypeUtilisateurCore> ObtenirTypeUtilisateurCoreParIdAsync(string id);
        Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurCoreAsync();
        Task<List<TypeUtilisateurCore>> ListeTypeUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeUtilisateurCore>> ListeTypeUtilisateurCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}