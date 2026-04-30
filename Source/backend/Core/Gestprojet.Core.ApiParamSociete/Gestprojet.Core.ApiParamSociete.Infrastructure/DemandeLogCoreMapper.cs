using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class DemandeLogCoreMapper
    {
        public static object GetParameters(DemandeLogCore demandeLogCore)
        {
            return new
            {
                demandeLogCore.Id,
                demandeLogCore.UtilisateurId,
                demandeLogCore.UtilisateurNom,
                demandeLogCore.Action,
                demandeLogCore.Description,
                demandeLogCore.EntiteType,
                demandeLogCore.EntiteId,
                demandeLogCore.IpAddress,
                demandeLogCore.DateCreation
            };
        }
    }
}
