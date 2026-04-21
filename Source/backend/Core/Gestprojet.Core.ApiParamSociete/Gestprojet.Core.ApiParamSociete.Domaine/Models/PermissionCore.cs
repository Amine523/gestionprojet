namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class PermissionCore
    {
        public string Id { get; set; }
        public string RoleId { get; set; }
        public string ModuleId { get; set; }
        public bool? PeutLire { get; set; }
        public bool? PeutCreer { get; set; }
        public bool? PeutModifier { get; set; }
        public bool? PeutSupprimer { get; set; }
        public bool? Actif { get; set; }
    }
}