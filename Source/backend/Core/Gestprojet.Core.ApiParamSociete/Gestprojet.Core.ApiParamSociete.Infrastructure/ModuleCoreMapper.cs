using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class ModuleCoreMapper
    {
        public static object GetParameters(ModuleCore moduleCore)
        {
            return new
            {
                moduleCore.Id,
                moduleCore.Nom,
                moduleCore.Actif,
            };
        }
    }
}
