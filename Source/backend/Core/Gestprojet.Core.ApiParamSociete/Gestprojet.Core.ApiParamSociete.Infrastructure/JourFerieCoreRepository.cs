using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class JourFerieCoreRepository : IJourFerieCoreRepository
    {
        private readonly DapperContext _context;

        public JourFerieCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterJourFerieCoreAsync(JourFerieCore jourFerieCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_JourFerie_i, new {
                            id = jourFerieCore.Id,
                            societeId = jourFerieCore.SocieteId,
                            nom = jourFerieCore.Nom,
                            date = jourFerieCore.Date,
                            actif = jourFerieCore.Actif,
                            dateCreation = jourFerieCore.DateCreation
                        }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierJourFerieCoreAsync(JourFerieCore jourFerieCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_JourFerie_u, new {
                            id = jourFerieCore.Id,
                            societeId = jourFerieCore.SocieteId,
                            nom = jourFerieCore.Nom,
                            date = jourFerieCore.Date,
                            actif = jourFerieCore.Actif,
                            dateCreation = jourFerieCore.DateCreation
                        }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerJourFerieCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_JourFerie_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerJourFerieCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_JourFerie_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de suppression par condition : {ex.Message}");
            }
        }

        public async Task<JourFerieCore> ObtenirJourFerieCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<JourFerieCore>
                        (Constants.Ps_JourFerie_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération : {ex.Message}");
            }
        }

        public async Task<List<JourFerieCore>> ListeJourFerieCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<JourFerieCore>
                        (Constants.Ps_JourFerie_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste : {ex.Message}");
            }
        }

        public async Task<List<JourFerieCore>> ListeJourFerieCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<JourFerieCore>
                        (Constants.Ps_JourFerie_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<JourFerieCore>> ListeJourFerieCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_JourFerie_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<JourFerieCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<JourFerieCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération paginée : {ex.Message}");
            }
        }

        public async Task<ResultatPage<JourFerieCore>> ListeJourFerieCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_JourFerie_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<JourFerieCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<JourFerieCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération paginée par condition : {ex.Message}");
            }
        }
    }
}
