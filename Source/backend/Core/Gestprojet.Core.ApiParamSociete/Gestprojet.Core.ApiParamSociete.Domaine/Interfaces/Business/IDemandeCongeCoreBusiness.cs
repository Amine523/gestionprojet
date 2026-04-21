using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IDemandeCongeCoreBusiness
    {
        Task<bool> AjouterDemandeCongeAsync(DemandeCongeCore demandeConge);
        Task<bool> ModifierDemandeCongeAsync(DemandeCongeCore demandeConge);
        Task<bool> SupprimerDemandeCongeAsync(string id);
        Task<DemandeCongeCore> ObtenirDemandeCongeParIdAsync(string id);
        Task<List<DemandeCongeCore>> ListeDemandeCongeAsync();
        Task<List<DemandeCongeCore>> ListeDemandeCongeParSocieteAsync(string societeId);
        Task<List<DemandeCongeCore>> ListeDemandeCongeParUtilisateurAsync(string utilisateurId);
    }

    public interface IJourFerieCoreBusiness
    {
        Task<bool> AjouterJourFerieAsync(JourFerieCore jourFerie);
        Task<bool> ModifierJourFerieAsync(JourFerieCore jourFerie);
        Task<bool> SupprimerJourFerieAsync(string id);
        Task<JourFerieCore> ObtenirJourFerieParIdAsync(string id);
        Task<List<JourFerieCore>> ListeJourFerieAsync();
        Task<List<JourFerieCore>> ListeJourFerieParSocieteAsync(string societeId);
    }
}
