using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class SousTacheCore
    {
        public string Id { get; set; }
        public string? TacheId { get; set; }
        [MaxLength(150)]
        public string Titre { get; set; }
        public string Description { get; set; }
        [MaxLength(50)]
        public string Statut { get; set; }
        public string DevComment { get; set; }
        public string TestComment { get; set; }
        public bool? Actif { get; set; }
    }
}