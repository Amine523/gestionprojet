using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class PointageCoreMapper
    {
        public static object GetParameters(PointageCore pointageCore)
        {
            return new
            {
                pointageCore.Id,
                pointageCore.UtilisateurId,
                pointageCore.TypeId,
                pointageCore.Date,
                pointageCore.HeureEntree,
                pointageCore.HeureSortie,
                pointageCore.Duree,
                pointageCore.Note,
                pointageCore.Actif,
            };
        }
    }
}
