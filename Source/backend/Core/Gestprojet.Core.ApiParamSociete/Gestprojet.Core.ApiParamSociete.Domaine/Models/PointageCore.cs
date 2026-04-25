using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class PointageCore
    {
        public string Id { get; set; }
        public string? UtilisateurId { get; set; }
        public string? TypeId { get; set; }
        public DateTime? Date { get; set; }
        public TimeSpan? HeureEntree { get; set; }
        public TimeSpan? HeureSortie { get; set; }
        public double? Duree { get; set; }
        [MaxLength(255)]
        public string Note { get; set; }
        public bool? Actif { get; set; }
    }
}