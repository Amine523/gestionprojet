using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class PaiementAuditCoreRepository : IPaiementAuditCoreRepository
    {
        private readonly DapperContext _context;
        public PaiementAuditCoreRepository(DapperContext context) => _context = context;

        public async Task<bool> AjouterAuditAsync(PaiementAuditCore audit)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.ExecuteAsync(Constants.Ps_PaiementAudit_i, PaiementAuditCoreMapper.GetParameters(audit), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<List<PaiementAuditCore>> ListeAuditParPaiementAsync(string paiementId)
        {
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<PaiementAuditCore>(Constants.Ps_PaiementAudit_s_Liste_ParPaiement, new { PaiementId = paiementId }, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<List<PaiementAuditCore>> ListeAuditGlobalAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<PaiementAuditCore>(Constants.Ps_PaiementAudit_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }
    }
}
