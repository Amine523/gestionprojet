using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class RoleCore
    {
        public string Id { get; set; }
        [MaxLength(100)]
        public string Nom { get; set; }
        public bool? Actif { get; set; }
    }
}