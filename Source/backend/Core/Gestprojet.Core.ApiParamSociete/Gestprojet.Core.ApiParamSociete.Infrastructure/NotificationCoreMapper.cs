using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class NotificationCoreMapper
    {
        public static object GetParameters(NotificationCore notification)
        {
            return new
            {
                notification.Id,
                notification.UtilisateurId,
                notification.Titre,
                notification.Contenu,
                notification.EstLu,
                notification.DateCreation
            };
        }
    }
}
