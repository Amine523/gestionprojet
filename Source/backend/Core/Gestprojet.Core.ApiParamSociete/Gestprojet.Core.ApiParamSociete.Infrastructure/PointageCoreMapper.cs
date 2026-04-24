using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class PointageCoreMapper
    {
        public static object GetParameters(PointageCore pointageCore)
        {
            return new
            {
                Id = pointageCore.Id,
                UtilisateurId = pointageCore.UtilisateurId,
                TypeId = pointageCore.TypeId,
                Date = pointageCore.Date,
                HeureEntree = pointageCore.HeureEntree.HasValue ? pointageCore.HeureEntree.Value.ToTimeSpan() : (TimeSpan?)null,
                HeureSortie = pointageCore.HeureSortie.HasValue ? pointageCore.HeureSortie.Value.ToTimeSpan() : (TimeSpan?)null,
                Duree = pointageCore.Duree,
                Note = pointageCore.Note,
                Actif = pointageCore.Actif
            };
        }
    }
}
