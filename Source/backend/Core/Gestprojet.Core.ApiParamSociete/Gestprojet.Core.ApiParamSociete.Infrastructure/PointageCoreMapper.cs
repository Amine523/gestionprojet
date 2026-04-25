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
                HeureEntree = pointageCore.HeureEntree,
                HeureSortie = pointageCore.HeureSortie,
                Duree = pointageCore.Duree,
                Note = pointageCore.Note,
                Actif = pointageCore.Actif
            };
        }
    }
}
