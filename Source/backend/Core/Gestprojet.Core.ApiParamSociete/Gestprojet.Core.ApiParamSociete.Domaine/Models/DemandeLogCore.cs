namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class DemandeLogCore
    {
        public string Id { get; set; }
        public string UtilisateurId { get; set; }
        public string UtilisateurNom { get; set; }
        public string Action { get; set; }
        public string Description { get; set; }
        public string EntiteType { get; set; }
        public string EntiteId { get; set; }
        public string IpAddress { get; set; }
        public DateTime? DateCreation { get; set; }
    }
}
