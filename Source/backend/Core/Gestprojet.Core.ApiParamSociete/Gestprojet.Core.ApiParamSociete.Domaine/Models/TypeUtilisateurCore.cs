using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class TypeUtilisateurCore
    {
        public string Id { get; set; }
        [MaxLength(100)]
        public string Nom { get; set; }
        [MaxLength(255)]
        public string Description { get; set; }
        public bool? Actif { get; set; }
    }
}