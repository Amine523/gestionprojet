using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IUtilisateurCoreBusiness
    {
        Task<bool> AjouterUtilisateurAsync(UtilisateurCore utilisateurCore);
        Task<bool> ModifierUtilisateurAsync(UtilisateurCore utilisateurCore);
        Task<bool> SupprimerUtilisateurAsync(string id);
        Task<bool> SupprimerUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<UtilisateurCore> ObtenirUtilisateurParIdAsync(string id);
        Task<UtilisateurCore> ObtenirUtilisateurParEmailAsync(string email);
        Task<List<UtilisateurCore>> ListeUtilisateurAsync();
        Task<List<UtilisateurCore>> ListeUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<UtilisateurCore>> ListeUtilisateurParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<UtilisateurCore>> ListeUtilisateurParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}