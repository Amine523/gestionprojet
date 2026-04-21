using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IProjetCoreRepository
    {
        Task<bool> AjouterProjetCoreAsync(ProjetCore projetCore);
        Task<bool> ModifierProjetCoreAsync(ProjetCore projetCore);
        Task<bool> SupprimerProjetCoreAsync(string id);
        Task<bool> SupprimerProjetCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ProjetCore> ObtenirProjetCoreParIdAsync(string id);
        Task<List<ProjetCore>> ListeProjetCoreAsync();
        Task<List<ProjetCore>> ListeProjetCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ProjetCore>> ListeProjetCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetCore>> ListeProjetCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
