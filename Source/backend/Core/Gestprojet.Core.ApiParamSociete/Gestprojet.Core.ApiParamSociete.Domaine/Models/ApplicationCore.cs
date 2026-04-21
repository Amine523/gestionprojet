using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ApplicationCore
    {
        public string Id { get; set; }
        public string? UtilisateurId { get; set; }
        public DateTime? AppelDate { get; set; }
        [MaxLength(50)]
        public string Statut { get; set; }
        public bool? Actif { get; set; }
        [MaxLength(50)]
        public string Type { get; set; }

        public void SetType(string type) => Type = type;
    }
}