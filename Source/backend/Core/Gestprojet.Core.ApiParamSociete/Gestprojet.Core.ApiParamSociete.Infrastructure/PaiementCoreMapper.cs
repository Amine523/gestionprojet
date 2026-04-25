using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class PaiementCoreMapper
    {
        public static DynamicParameters GetParameters(PaiementCore entity)
        {
            var p = new DynamicParameters();
            p.Add("@Id", entity.Id);
            p.Add("@SocieteId", entity.SocieteId);
            p.Add("@SocieteNom", entity.SocieteNom);
            p.Add("@Description", entity.Description);
            p.Add("@Montant", entity.Montant);
            p.Add("@Date", entity.Date);
            p.Add("@Statut", entity.Statut);
            p.Add("@Type", entity.Type);
            return p;
        }
    }
}
