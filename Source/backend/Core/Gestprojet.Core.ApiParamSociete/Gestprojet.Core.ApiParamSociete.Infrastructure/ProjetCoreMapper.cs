using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class ProjetCoreMapper
    {
        public static object GetParameters(ProjetCore projetCore)
        {
            return new
            {
                projetCore.Id,
                projetCore.Nom,
                projetCore.Description,
                projetCore.StartDate,
                projetCore.EndDate,
                projetCore.Status,
                projetCore.Priorite,
                projetCore.UtilisateurId,
                projetCore.Actif,
            };
        }
    }
}
