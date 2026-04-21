using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class ProjetUtilisateurCoreMapper
    {
        public static object GetParameters(ProjetUtilisateurCore projetUtilisateurCore)
        {
            return new
            {
                projetUtilisateurCore.Id,
                projetUtilisateurCore.ProjetId,
                projetUtilisateurCore.UtilisateurId,
                projetUtilisateurCore.Actif,
            };
        }
    }
}
