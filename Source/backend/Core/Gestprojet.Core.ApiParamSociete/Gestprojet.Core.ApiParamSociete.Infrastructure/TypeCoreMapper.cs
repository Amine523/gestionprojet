using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class TypeCoreMapper
    {
        public static object GetParameters(TypeCore typeCore)
        {
            return new
            {
                typeCore.Id,
                typeCore.Nom,
                typeCore.Description,
                typeCore.Actif,
            };
        }
    }
}
