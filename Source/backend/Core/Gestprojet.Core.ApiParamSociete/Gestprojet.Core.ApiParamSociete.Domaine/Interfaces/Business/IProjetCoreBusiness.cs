using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IProjetCoreBusiness
    {
        Task<bool> AjouterProjetAsync(ProjetCore projetCore);
        Task<bool> ModifierProjetAsync(ProjetCore projetCore);
        Task<bool> SupprimerProjetAsync(string id);
        Task<bool> SupprimerProjetParConditionAsync(CritereRecherche critereRecherche);
        Task<ProjetCore> ObtenirProjetParIdAsync(string id);
        Task<List<ProjetCore>> ListeProjetAsync();
        Task<List<ProjetCore>> ListeProjetParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ProjetCore>> ListeProjetParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ProjetCore>> ListeProjetParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
