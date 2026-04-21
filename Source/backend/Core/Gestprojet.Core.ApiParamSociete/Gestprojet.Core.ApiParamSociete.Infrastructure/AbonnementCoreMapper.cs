using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class AbonnementCoreMapper
    {
        public static object GetParameters(AbonnementCore AbonnementCore)
        {
            return new
            {
                AbonnementCore.Id,
                AbonnementCore.SocieteId,
                AbonnementCore.TypeAbonnement,
                AbonnementCore.DateDebut,
                AbonnementCore.DateFin,
                AbonnementCore.Actif,
            };
        }
    }
}
