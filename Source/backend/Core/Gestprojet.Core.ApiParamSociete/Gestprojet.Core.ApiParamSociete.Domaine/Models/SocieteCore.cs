using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class SocieteCore
    {
        public string Id { get; set; } = string.Empty;
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string? Nom { get; set; }
        [MaxLength(255)]
        public string? Adresse { get; set; }
        [MaxLength(100)]
        public string? PlanAbonnement { get; set; }
        public bool? Actif { get; set; }
        
        [Phone]
        [MaxLength(50)]
        public string? TelephoneContact { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }
        [MaxLength(20)]
        public string? CodePostale { get; set; }
        [MaxLength(100)]
        public string? Ville { get; set; }
        [MaxLength(100)]
        public string? Pays { get; set; }
        [MaxLength(100)]
        public string? PersonneContact { get; set; }
        [MaxLength(50)]
        public string? Fax { get; set; }
        [MaxLength(255)]
        public string? SiteWeb { get; set; }
    }
}