using Gestprojet.Core.ApiParamSociete.Client.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository
{
    public interface IDemandeCongeRepository
    {
        Task<bool> AjouterAsync(DemandeCongeCore entity);
        Task<bool> ModifierAsync(DemandeCongeCore entity);
        Task<DemandeCongeCore> ObtenirAsync(string id);
        Task<List<DemandeCongeCore>> ListeAsync();
        Task<List<DemandeCongeCore>> ListeParUtilisateurAsync(string utilisateurId);
        Task<List<DemandeCongeCore>> ListeParSocieteAsync(string societeId);
        Task<bool> SupprimerAsync(string id);
    }
}
