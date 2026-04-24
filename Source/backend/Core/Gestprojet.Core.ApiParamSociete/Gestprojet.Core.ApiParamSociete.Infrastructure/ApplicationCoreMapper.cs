using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class ApplicationCoreMapper
    {
        public static object GetParameters(ApplicationCore applicationCore)
        {
            return new
            {
                Id = applicationCore.Id,
                UtilisateurId = applicationCore.UtilisateurId,
                SocieteId = applicationCore.SocieteId,
                OffreId = applicationCore.OffreId,
                Titre = applicationCore.Titre,
                Description = applicationCore.Description,
                Lieu = applicationCore.Lieu,
                Salaire = applicationCore.Salaire,
                Poste = applicationCore.Poste,
                Quiz = applicationCore.Quiz,
                AppelDate = applicationCore.AppelDate,
                Statut = applicationCore.Statut,
                Type = applicationCore.Type,
                Actif = applicationCore.Actif
            };
        }
    }
}
