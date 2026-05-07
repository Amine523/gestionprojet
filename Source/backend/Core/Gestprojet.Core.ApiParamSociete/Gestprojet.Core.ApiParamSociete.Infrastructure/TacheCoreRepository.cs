using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class TacheCoreRepository : ITacheCoreRepository
    {
        private readonly DapperContext _context;

        public TacheCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterTacheCoreAsync(TacheCore tacheCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Tache_i, TacheCoreMapper.GetParameters(tacheCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierTacheCoreAsync(TacheCore tacheCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Tache_u, TacheCoreMapper.GetParameters(tacheCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerTacheCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Tache_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerTacheCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                critereRecherche.SocieteId = null;
                if (critereRecherche.Criteres != null && critereRecherche.Criteres.ContainsKey("SocieteId"))
                    critereRecherche.Criteres.Remove("SocieteId");
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Tache_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression par condition : {ex.Message}");
            }
        }

        public async Task<TacheCore> ObtenirTacheCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<TacheCore>
                        (Constants.Ps_Tache_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration : {ex.Message}");
            }
        }

        public async Task<List<TacheCore>> ListeTacheCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<TacheCore>
                        (Constants.Ps_Tache_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste : {ex.Message}");
            }
        }

        public async Task<List<TacheCore>> ListeTacheCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                critereRecherche.SocieteId = null;
                if (critereRecherche.Criteres != null && critereRecherche.Criteres.ContainsKey("SocieteId"))
                    critereRecherche.Criteres.Remove("SocieteId");
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<TacheCore>
                        (Constants.Ps_Tache_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<TacheCore>> ListeTacheCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Tache_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<TacheCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<TacheCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e : {ex.Message}");
            }
        }

        public async Task<ResultatPage<TacheCore>> ListeTacheCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                critereRecherche.SocieteId = null;
                if (critereRecherche.Criteres != null && critereRecherche.Criteres.ContainsKey("SocieteId"))
                    critereRecherche.Criteres.Remove("SocieteId");
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Tache_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<TacheCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<TacheCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e par condition : {ex.Message}");
            }
        }
    }
}
