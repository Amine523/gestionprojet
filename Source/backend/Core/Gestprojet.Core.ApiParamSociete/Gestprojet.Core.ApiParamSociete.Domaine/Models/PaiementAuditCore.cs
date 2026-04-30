using System;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class PaiementAuditCore
    {
        public string Id { get; set; } = string.Empty;
        public string PaiementId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty; // Création, Validation, Refus, CommissionUpdate
        public string UtilisateurId { get; set; } = string.Empty;
        public string UtilisateurNom { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime DateEvenement { get; set; } = DateTime.Now;
        public string IpAddress { get; set; } = string.Empty;
    }
}