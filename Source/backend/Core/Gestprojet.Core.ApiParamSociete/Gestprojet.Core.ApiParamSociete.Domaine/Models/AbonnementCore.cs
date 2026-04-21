namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class AbonnementCore
    {
        public string Id { get; set; }
        public string SocieteId { get; set; }
        public string TypeAbonnement { get; set; }
        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }
        public bool? Actif { get; set; }
    }
}
