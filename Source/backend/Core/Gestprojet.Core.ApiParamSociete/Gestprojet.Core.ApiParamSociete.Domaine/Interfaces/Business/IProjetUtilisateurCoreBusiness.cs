using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IProjetUtilisateurCoreBusiness
    {
        Task<bool> AjouterProjetUtilisateurAsync(ProjetUtilisateurCore projetUtilisateurCore);
        Task<bool> ModifierProjetUtilisateurAsync(ProjetUtilisateurCore projetUtilisateurCore);
        Task<bool> SupprimerProjetUtilisateurAsync(string id);
        Task<bool> SupprimerProjetUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<ProjetUtilisateurCore> ObtenirProjetUtilisateurParIdAsync(string id);
        Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurAsync();
        Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
