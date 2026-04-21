using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IAttachementCoreBusiness
    {
        Task<bool> AjouterAttachementAsync(AttachementCore attachementCore);
        Task<bool> ModifierAttachementAsync(AttachementCore attachementCore);
        Task<bool> SupprimerAttachementAsync(string id);
        Task<bool> SupprimerAttachementParConditionAsync(CritereRecherche critereRecherche);
        Task<AttachementCore> ObtenirAttachementParIdAsync(string id);
        Task<List<AttachementCore>> ListeAttachementAsync();
        Task<List<AttachementCore>> ListeAttachementParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<AttachementCore>> ListeAttachementParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<AttachementCore>> ListeAttachementParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}