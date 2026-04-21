namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class DemandeCongeCore
    {
        public string Id { get; set; }
        public string UtilisateurId { get; set; }
        public string SocieteId { get; set; }
        public string TypePointageId { get; set; }
        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }
        public string Status { get; set; }
        public string Motif { get; set; }
        public bool AvecCertificat { get; set; }
        public int Jours { get; set; }
        public DateTime? DateCreation { get; set; }
        public string ValideParId { get; set; }
    }

    public class JourFerieCore
    {
        public string Id { get; set; }
        public string SocieteId { get; set; }
        public string Nom { get; set; }
        public DateTime Date { get; set; }
        public bool Actif { get; set; }
        public DateTime? DateCreation { get; set; }
    }
}
