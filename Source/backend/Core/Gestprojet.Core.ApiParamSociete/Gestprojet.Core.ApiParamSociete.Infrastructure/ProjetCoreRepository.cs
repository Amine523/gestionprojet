using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class ProjetCoreRepository : IProjetCoreRepository
    {
        private readonly DapperContext _context;

        public ProjetCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterProjetCoreAsync(ProjetCore ProjetCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Projet_i, ProjetCoreMapper.GetParameters(ProjetCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierProjetCoreAsync(ProjetCore ProjetCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Projet_u, ProjetCoreMapper.GetParameters(ProjetCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerProjetCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Projet_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerProjetCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Projet_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression par condition : {ex.Message}");
            }
        }

        public async Task<ProjetCore> ObtenirProjetCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<ProjetCore>
                        (Constants.Ps_Projet_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration : {ex.Message}");
            }
        }

        public async Task<List<ProjetCore>> ListeProjetCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<ProjetCore>
                        (Constants.Ps_Projet_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste : {ex.Message}");
            }
        }

        public async Task<List<ProjetCore>> ListeProjetCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<ProjetCore>
                        (Constants.Ps_Projet_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<ProjetCore>> ListeProjetCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Projet_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<ProjetCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<ProjetCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e : {ex.Message}");
            }
        }

        public async Task<ResultatPage<ProjetCore>> ListeProjetCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Projet_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<ProjetCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<ProjetCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e par condition : {ex.Message}");
            }
        }
    }
}
