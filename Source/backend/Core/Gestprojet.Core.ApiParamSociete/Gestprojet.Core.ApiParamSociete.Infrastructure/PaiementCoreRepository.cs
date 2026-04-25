using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class PaiementCoreRepository : IPaiementCoreRepository
    {
        private readonly DapperContext _context;
        public PaiementCoreRepository(DapperContext context) => _context = context;

        public async Task<bool> AjouterPaiementCoreAsync(PaiementCore entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Paiement_i, PaiementCoreMapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> ModifierPaiementCoreAsync(PaiementCore entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Paiement_u, PaiementCoreMapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> SupprimerPaiementCoreAsync(string id)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Paiement_d, new { id }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> SupprimerPaiementCoreParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Paiement_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<PaiementCore> ObtenirPaiementCoreParIdAsync(string id)
        {
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<PaiementCore>(Constants.Ps_Paiement_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<PaiementCore>> ListePaiementCoreAsync()
        {
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<PaiementCore>(Constants.Ps_Paiement_s_Liste, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<List<PaiementCore>> ListePaiementCoreParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<PaiementCore>(Constants.Ps_Paiement_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<ResultatPage<PaiementCore>> ListePaiementCoreParPageAsync(int pageNumero, int pageTaille)
        {
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_Paiement_s_Liste_Page, new { PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<PaiementCore>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<PaiementCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }

        public async Task<ResultatPage<PaiementCore>> ListePaiementCoreParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_Paiement_s_Liste_ParCondition_Page, new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<PaiementCore>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<PaiementCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }
    }
}
