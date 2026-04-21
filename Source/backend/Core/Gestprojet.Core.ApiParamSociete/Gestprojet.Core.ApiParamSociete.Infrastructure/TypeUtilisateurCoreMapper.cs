using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class TypeUtilisateurCoreMapper
    {
        public static object GetParameters(TypeUtilisateurCore typeutilisateurCore)
        {
            return new
            {
                typeutilisateurCore.Id,
                typeutilisateurCore.Nom,
                typeutilisateurCore.Description,
                typeutilisateurCore.Actif,
            };
        }
    }
}
