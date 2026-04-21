using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class AbonnementCoreRepository : IAbonnementCoreRepository
    {
        private readonly DapperContext _context;
        public AbonnementCoreRepository(DapperContext context) => _context = context;

        public async Task<bool> AjouterAbonnementCoreAsync(AbonnementCore entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Abonnement_i, AbonnementCoreMapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> ModifierAbonnementCoreAsync(AbonnementCore entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Abonnement_u, AbonnementCoreMapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> SupprimerAbonnementCoreAsync(string id)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Abonnement_d, new { id }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> SupprimerAbonnementCoreParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_Abonnement_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<AbonnementCore> ObtenirAbonnementCoreParIdAsync(string id)
        {
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<AbonnementCore>(Constants.Ps_Abonnement_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<AbonnementCore>> ListeAbonnementCoreAsync()
        {
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<AbonnementCore>(Constants.Ps_Abonnement_s_Liste, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<List<AbonnementCore>> ListeAbonnementCoreParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<AbonnementCore>(Constants.Ps_Abonnement_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParPageAsync(int pageNumero, int pageTaille)
        {
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_Abonnement_s_Liste_Page, new { PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<AbonnementCore>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<AbonnementCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }

        public async Task<ResultatPage<AbonnementCore>> ListeAbonnementCoreParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_Abonnement_s_Liste_ParCondition_Page, new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<AbonnementCore>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<AbonnementCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }
    }
}
