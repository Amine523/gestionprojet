namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class NotificationCore
    {
        public string Id { get; set; }
        public string UtilisateurId { get; set; }
        public string Titre { get; set; }
        public string Contenu { get; set; }
        public bool? EstLu { get; set; }
        public DateTime? DateCreation { get; set; }
    }
}
