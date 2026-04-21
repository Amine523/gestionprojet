using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IAttachementCoreRepository
    {
        Task<bool> AjouterAttachementCoreAsync(AttachementCore attachementCore);
        Task<bool> ModifierAttachementCoreAsync(AttachementCore attachementCore);
        Task<bool> SupprimerAttachementCoreAsync(string id);
        Task<bool> SupprimerAttachementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<AttachementCore> ObtenirAttachementCoreParIdAsync(string id);
        Task<List<AttachementCore>> ListeAttachementCoreAsync();
        Task<List<AttachementCore>> ListeAttachementCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<AttachementCore>> ListeAttachementCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<AttachementCore>> ListeAttachementCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}