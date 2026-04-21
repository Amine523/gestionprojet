using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class RoleCoreMapper
    {
        public static object GetParameters(RoleCore roleCore)
        {
            return new
            {
                roleCore.Id,
                roleCore.Nom,
                roleCore.Actif,
            };
        }
    }
}
