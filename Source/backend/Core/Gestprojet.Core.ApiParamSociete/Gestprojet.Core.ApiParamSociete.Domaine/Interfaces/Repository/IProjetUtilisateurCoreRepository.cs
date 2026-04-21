using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IProjetUtilisateurCoreRepository
    {
        Task<bool> AjouterProjetUtilisateurCoreAsync(ProjetUtilisateurCore projetUtilisateurCore);
        Task<bool> ModifierProjetUtilisateurCoreAsync(ProjetUtilisateurCore projetUtilisateurCore);
        Task<bool> SupprimerProjetUtilisateurCoreAsync(string id);
        Task<bool> SupprimerProjetUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ProjetUtilisateurCore> ObtenirProjetUtilisateurCoreParIdAsync(string id);
        Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreAsync();
        Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
