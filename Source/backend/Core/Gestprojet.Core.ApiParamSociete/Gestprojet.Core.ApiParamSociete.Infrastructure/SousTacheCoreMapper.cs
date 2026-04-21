using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class SousTacheCoreMapper
    {
        public static object GetParameters(SousTacheCore soustacheCore)
        {
            return new
            {
                soustacheCore.Id,
                soustacheCore.TacheId,
                soustacheCore.Titre,
                soustacheCore.Description,
                soustacheCore.Statut,
                soustacheCore.DevComment,
                soustacheCore.TestComment,
                soustacheCore.Actif,
            };
        }
    }
}
