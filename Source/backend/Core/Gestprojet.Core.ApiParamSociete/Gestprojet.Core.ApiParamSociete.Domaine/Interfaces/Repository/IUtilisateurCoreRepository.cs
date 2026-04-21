using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IUtilisateurCoreRepository
    {
        Task<bool> AjouterUtilisateurCoreAsync(UtilisateurCore utilisateurCore);
        Task<bool> ModifierUtilisateurCoreAsync(UtilisateurCore utilisateurCore);
        Task<bool> SupprimerUtilisateurCoreAsync(string id);
        Task<bool> SupprimerUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<UtilisateurCore> ObtenirUtilisateurCoreParIdAsync(string id);
        Task<UtilisateurCore> ObtenirUtilisateurCoreParEmailAsync(string email);
        Task<List<UtilisateurCore>> ListeUtilisateurCoreAsync();
        Task<List<UtilisateurCore>> ListeUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<UtilisateurCore>> ListeUtilisateurCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<UtilisateurCore>> ListeUtilisateurCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}