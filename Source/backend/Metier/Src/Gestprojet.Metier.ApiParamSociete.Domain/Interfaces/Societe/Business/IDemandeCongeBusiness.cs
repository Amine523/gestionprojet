using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business
{
    public interface IDemandeCongeBusiness
    {
        Task<OperationResult> AjouterOuModifierAsync(DemandeCongeCore entity);
        Task<DemandeCongeCore> ObtenirAsync(string id);
        Task<IEnumerable<DemandeCongeCore>> ListeAsync();
        Task<IEnumerable<DemandeCongeCore>> ListeParUtilisateurAsync(string utilisateurId);
        Task<IEnumerable<DemandeCongeCore>> ListeParSocieteAsync(string societeId);
        Task<OperationResult> SupprimerAsync(string id);
    }
}
