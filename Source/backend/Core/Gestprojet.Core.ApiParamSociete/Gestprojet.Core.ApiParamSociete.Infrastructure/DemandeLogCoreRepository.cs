using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Commun;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class DemandeLogCoreRepository : IDemandeLogCoreRepository
    {
        private readonly DapperContext _context;

        public DemandeLogCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterDemandeLogCoreAsync(DemandeLogCore demandeLogCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_DemandeLog_i, DemandeLogCoreMapper.GetParameters(demandeLogCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème d'ajout de log : {ex.Message}");
            }
        }

        public async Task<List<DemandeLogCore>> ListeDemandeLogCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryAsync<DemandeLogCore>
                        (Constants.Ps_DemandeLog_s_Liste, commandType: CommandType.StoredProcedure);
                    return response.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de liste de logs : {ex.Message}");
            }
        }

        public async Task<List<DemandeLogCore>> ListeDemandeLogCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryAsync<DemandeLogCore>
                        (Constants.Ps_DemandeLog_s_Liste_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de liste de logs par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<DemandeLogCore>> ListeDemandeLogCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryMultipleAsync
                        (Constants.Ps_DemandeLog_s_Liste_Page, new { PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
                    
                    var result = new ResultatPage<DemandeLogCore>
                    {
                        Items = (await response.ReadAsync<DemandeLogCore>()).ToList(),
                        TotalCount = await response.ReadFirstOrDefaultAsync<int>(),
                        PageNumber = pageNumero,
                        PageSize = pageTaille
                    };
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de liste de logs par page : {ex.Message}");
            }
        }
    }
}
