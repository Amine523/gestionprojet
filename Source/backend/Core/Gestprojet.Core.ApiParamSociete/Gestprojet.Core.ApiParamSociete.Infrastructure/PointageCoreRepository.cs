using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class PointageCoreRepository : IPointageCoreRepository
    {
        private readonly DapperContext _context;

        public PointageCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterPointageCoreAsync(PointageCore PointageCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    // Don't generate ID - Metier API handles ID generation
                    var parameters = PointageCoreMapper.GetParameters(PointageCore);
                    
                    Console.WriteLine($"DEBUG Pointage Insert: Id={PointageCore.Id}, UtilisateurId={PointageCore.UtilisateurId}, TypeId={PointageCore.TypeId}, Date={PointageCore.Date}");
                    
                    var sql = @"
                        INSERT INTO [dbo].[Pointage]
                        ([Id], [UtilisateurId], [TypeId], [Date], [HeureEntree], [HeureSortie], [Duree], [Note], [Actif])
                        VALUES
                        (@Id, @UtilisateurId, @TypeId, @Date, @HeureEntree, @HeureSortie, @Duree, @Note, @Actif);
                    ";
                    var response = await connection.ExecuteAsync(sql, parameters);
                    Console.WriteLine($"DEBUG Pointage Insert Result: {response}");
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DEBUG Pointage Insert Error: {ex.Message}");
                throw new Exception($"Problème d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierPointageCoreAsync(PointageCore PointageCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = @"
                        UPDATE [dbo].[Pointage]
                        SET [UtilisateurId] = @UtilisateurId,
                            [TypeId] = @TypeId,
                            [Date] = @Date,
                            [HeureEntree] = @HeureEntree,
                            [HeureSortie] = @HeureSortie,
                            [Duree] = @Duree,
                            [Note] = @Note,
                            [Actif] = @Actif
                        WHERE [Id] = @Id;
                    ";
                    var response = await connection.ExecuteAsync(sql, PointageCoreMapper.GetParameters(PointageCore));
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DEBUG Pointage Update Error: {ex.Message}");
                throw new Exception($"Problème de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerPointageCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Pointage_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerPointageCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Pointage_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problme de suppression par condition : {ex.Message}");
            }
        }

        public async Task<PointageCore> ObtenirPointageCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = "SELECT * FROM [dbo].[Pointage] WHERE [Id] = @id";
                    return await connection.QueryFirstOrDefaultAsync<PointageCore>(sql, new { id });
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération : {ex.Message}");
            }
        }

        public async Task<List<PointageCore>> ListePointageCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var sql = "SELECT * FROM [dbo].[Pointage] ORDER BY [Date] DESC, [HeureEntree] DESC";
                    var result = await connection.QueryAsync<PointageCore>(sql);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste : {ex.Message}");
            }
        }

        public async Task<List<PointageCore>> ListePointageCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    string sql = "SELECT * FROM [dbo].[Pointage]";
                    if (!string.IsNullOrWhiteSpace(condition))
                    {
                        sql += " WHERE " + condition;
                    }
                    sql += " ORDER BY [Date] DESC, [HeureEntree] DESC";
                    
                    var result = await connection.QueryAsync<PointageCore>(sql);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<PointageCore>> ListePointageCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Pointage_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<PointageCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<PointageCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e : {ex.Message}");
            }
        }

        public async Task<ResultatPage<PointageCore>> ListePointageCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Pointage_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<PointageCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<PointageCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e par condition : {ex.Message}");
            }
        }
    }
}
