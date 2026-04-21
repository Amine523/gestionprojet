using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class PermissionCoreMapper
    {
        public static object GetParameters(PermissionCore permissionCore)
        {
            return new
            {
                permissionCore.Id,
                permissionCore.RoleId,
                permissionCore.ModuleId,
                permissionCore.PeutLire,
                permissionCore.PeutCreer,
                permissionCore.PeutModifier,
                permissionCore.PeutSupprimer,
                permissionCore.Actif,
            };
        }
    }
}
