using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IPaiementAuditCoreRepository
    {
        Task<bool> AjouterAuditAsync(PaiementAuditCore audit);
        Task<List<PaiementAuditCore>> ListeAuditParPaiementAsync(string paiementId);
        Task<List<PaiementAuditCore>> ListeAuditGlobalAsync(CritereRecherche critere);
    }
}