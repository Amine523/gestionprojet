using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class UtilisateurCore
    {
        public string? Id { get; set; }
        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string? Nom { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string? Email { get; set; }
        [MinLength(8)]
        [MaxLength(255)]
        public string? MotDePasse { get; set; }
        [MaxLength(255)]
        public string? CV { get; set; }
        [Required]
        public string? TypeUtilisateurId { get; set; }
        public string? SocieteId { get; set; }
        public string? RoleId { get; set; }
        public bool? Actif { get; set; }
        [Phone]
        public string? Telephone { get; set; }
    }
}