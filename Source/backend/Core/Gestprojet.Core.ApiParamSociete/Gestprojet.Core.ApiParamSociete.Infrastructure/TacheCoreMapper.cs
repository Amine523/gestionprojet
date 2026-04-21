using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class TacheCoreMapper
    {
        public static object GetParameters(TacheCore tacheCore)
        {
            return new
            {
                tacheCore.Id,
                tacheCore.ProjetId,
                tacheCore.Titre,
                tacheCore.Description,
                tacheCore.Statut,
                tacheCore.Priorite,
                tacheCore.DateLimite,
                tacheCore.TempsEstime,
                tacheCore.TempsReel,
                tacheCore.DevComment,
                tacheCore.TestComment,
                tacheCore.Actif,
            };
        }
    }
}
