using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class UtilisateurCore
    {
        public string? Id { get; set; }
        [MaxLength(100)]
        public string? Nom { get; set; }
        [MaxLength(150)]
        public string? Email { get; set; }
        [MaxLength(255)]
        public string? MotDePasse { get; set; }
        [MaxLength(255)]
        public string? CV { get; set; }
        public string? TypeUtilisateurId { get; set; }
        public string? SocieteId { get; set; }
        public string? RoleId { get; set; }
        public bool? Actif { get; set; }
        public string? Telephone { get; set; }
    }
}