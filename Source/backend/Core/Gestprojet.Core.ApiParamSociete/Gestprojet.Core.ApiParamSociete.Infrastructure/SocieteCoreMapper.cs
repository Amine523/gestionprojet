using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class SocieteCoreMapper
    {
        public static object GetParameters(SocieteCore societeCore)
        {
            return new
            {
                societeCore.Id,
                societeCore.Nom,
                societeCore.Adresse,
                societeCore.PlanAbonnement,
                societeCore.Actif,
                societeCore.TelephoneContact,
                societeCore.Email,
                societeCore.CodePostale,
                societeCore.Ville,
                societeCore.Pays,
                societeCore.PersonneContact,
                societeCore.Fax,
                societeCore.SiteWeb,
            };
        }
    }
}
