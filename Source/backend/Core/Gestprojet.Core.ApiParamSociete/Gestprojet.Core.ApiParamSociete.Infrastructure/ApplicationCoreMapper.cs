using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class ApplicationCoreMapper
    {
        public static object GetParameters(ApplicationCore applicationCore)
        {
            return new
            {
                applicationCore.Id,
                applicationCore.UtilisateurId,
                applicationCore.AppelDate,
                applicationCore.Statut,
                applicationCore.Actif,
            };
        }
    }
}
