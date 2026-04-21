using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class UtilisateurCoreMapper
    {
        public static object GetParameters(UtilisateurCore utilisateurCore)
        {
            return new
            {
                utilisateurCore.Id,
                utilisateurCore.Nom,
                utilisateurCore.Email,
                utilisateurCore.MotDePasse,
                utilisateurCore.CV,
                utilisateurCore.TypeUtilisateurId,
                utilisateurCore.SocieteId,
                utilisateurCore.RoleId,
                utilisateurCore.Actif,
            };
        }
    }
}
