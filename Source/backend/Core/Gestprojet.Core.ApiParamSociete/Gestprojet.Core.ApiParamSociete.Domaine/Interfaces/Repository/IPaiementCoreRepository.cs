using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IPaiementCoreRepository
    {
        Task<bool> AjouterPaiementCoreAsync(PaiementCore PaiementCore);
        Task<bool> ModifierPaiementCoreAsync(PaiementCore PaiementCore);
        Task<bool> SupprimerPaiementCoreAsync(string id);
        Task<bool> SupprimerPaiementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<PaiementCore> ObtenirPaiementCoreParIdAsync(string id);
        Task<List<PaiementCore>> ListePaiementCoreAsync();
        Task<List<PaiementCore>> ListePaiementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<PaiementCore>> ListePaiementCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PaiementCore>> ListePaiementCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
