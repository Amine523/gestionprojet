using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface INotificationCoreRepository
    {
        Task<bool> AjouterNotificationCoreAsync(NotificationCore notification);
        Task<bool> ModifierNotificationCoreAsync(NotificationCore notification);
        Task<bool> SupprimerNotificationCoreAsync(string id);
        Task<NotificationCore> ObtenirNotificationCoreParIdAsync(string id);
        Task<List<NotificationCore>> ListeNotificationCoreAsync();
        Task<List<NotificationCore>> ListeNotificationCoreParConditionAsync(CritereRecherche critereRecherche);
    }
}
