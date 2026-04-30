using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class PaiementAuditCoreMapper
    {
        public static DynamicParameters GetParameters(PaiementAuditCore entity)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", entity.Id);
            parameters.Add("@PaiementId", entity.PaiementId);
            parameters.Add("@Action", entity.Action);
            parameters.Add("@UtilisateurId", entity.UtilisateurId);
            parameters.Add("@UtilisateurNom", entity.UtilisateurNom);
            parameters.Add("@Details", entity.Details);
            parameters.Add("@DateEvenement", entity.DateEvenement);
            parameters.Add("@IpAddress", entity.IpAddress);
            return parameters;
        }
    }
}
