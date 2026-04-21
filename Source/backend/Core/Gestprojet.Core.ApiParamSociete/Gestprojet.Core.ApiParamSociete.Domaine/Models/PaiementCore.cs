namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class PaiementCore
    {
        public string Id { get; set; }
        public string SocieteId { get; set; }
        public string SocieteNom { get; set; }
        public string Description { get; set; }
        public decimal Montant { get; set; }
        public DateTime? Date { get; set; }
        public string Statut { get; set; }
        public string Type { get; set; }
    }
}
