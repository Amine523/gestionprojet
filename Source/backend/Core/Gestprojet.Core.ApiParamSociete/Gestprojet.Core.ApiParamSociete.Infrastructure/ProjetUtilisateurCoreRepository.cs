using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class ProjetUtilisateurCoreRepository : IProjetUtilisateurCoreRepository
    {
        private readonly DapperContext _context;

        public ProjetUtilisateurCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterProjetUtilisateurCoreAsync(ProjetUtilisateurCore projetUtilisateurCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_ProjetUtilisateur_i, ProjetUtilisateurCoreMapper.GetParameters(projetUtilisateurCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierProjetUtilisateurCoreAsync(ProjetUtilisateurCore projetUtilisateurCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_ProjetUtilisateur_u, ProjetUtilisateurCoreMapper.GetParameters(projetUtilisateurCore), commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerProjetUtilisateurCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_ProjetUtilisateur_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerProjetUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_ProjetUtilisateur_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de suppression par condition : {ex.Message}");
            }
        }

        public async Task<ProjetUtilisateurCore> ObtenirProjetUtilisateurCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<ProjetUtilisateurCore>
                        (Constants.Ps_ProjetUtilisateur_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de rcupration : {ex.Message}");
            }
        }

        public async Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<ProjetUtilisateurCore>
                        (Constants.Ps_ProjetUtilisateur_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de rcupration de la liste : {ex.Message}");
            }
        }

        public async Task<List<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<ProjetUtilisateurCore>
                        (Constants.Ps_ProjetUtilisateur_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de rcupration de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_ProjetUtilisateur_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<ProjetUtilisateurCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<ProjetUtilisateurCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de rcupration pagine : {ex.Message}");
            }
        }

        public async Task<ResultatPage<ProjetUtilisateurCore>> ListeProjetUtilisateurCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_ProjetUtilisateur_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<ProjetUtilisateurCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<ProjetUtilisateurCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de rcupration pagine par condition : {ex.Message}");
            }
        }
    }
}
