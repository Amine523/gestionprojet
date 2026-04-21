using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ProjetCore
    {
        public string Id { get; set; }
        [MaxLength(150)]
        public string Nom { get; set; }
        public string Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [MaxLength(50)]
        public string Status { get; set; }
        [MaxLength(50)]
        public string Priorite { get; set; }
        public string? UtilisateurId { get; set; }
        public bool? Actif { get; set; }
    }
}