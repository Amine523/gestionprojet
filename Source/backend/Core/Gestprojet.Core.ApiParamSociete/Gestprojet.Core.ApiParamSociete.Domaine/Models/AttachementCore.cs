using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class AttachementCore
    {
        public string Id { get; set; }
        public string? TacheId { get; set; }
        public string? ProjetId { get; set; }
        [MaxLength(255)]
        public string CheminFichier { get; set; }
        [MaxLength(50)]
        public string TypeFichier { get; set; }
        public bool? Actif { get; set; }
    }
}