using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IPaiementCoreBusiness
    {
        Task<bool> AjouterPaiementCoreAsync(PaiementCore entity);
        Task<bool> ModifierPaiementCoreAsync(PaiementCore entity);
        Task<bool> SupprimerPaiementCoreAsync(string id);
        Task<PaiementCore> ObtenirPaiementCoreParIdAsync(string id);
        Task<List<PaiementCore>> ListePaiementCoreAsync();
        Task<List<PaiementCore>> ListePaiementCoreParConditionAsync(CritereRecherche critere);
        Task<ResultatPage<PaiementCore>> ListePaiementCoreParPageAsync(int pageNumero, int pageTaille);
    }
}
