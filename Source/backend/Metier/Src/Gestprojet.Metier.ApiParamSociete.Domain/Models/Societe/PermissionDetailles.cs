using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class PermissionDetailles
    {
        public PermissionCore Permission { get; set; }
        public RoleCore RoleId { get; set; }
        public ModuleCore ModuleId { get; set; }
    }
}
