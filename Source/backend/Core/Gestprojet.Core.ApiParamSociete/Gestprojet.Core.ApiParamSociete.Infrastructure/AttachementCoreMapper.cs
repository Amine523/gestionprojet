using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class AttachementCoreMapper
    {
        public static object GetParameters(AttachementCore attachementCore)
        {
            return new
            {
                attachementCore.Id,
                attachementCore.TacheId,
                attachementCore.ProjetId,
                attachementCore.CheminFichier,
                attachementCore.TypeFichier,
                attachementCore.Actif,
            };
        }
    }
}
