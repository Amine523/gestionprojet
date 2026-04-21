using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class UtilisateurCoreRepository : IUtilisateurCoreRepository
    {
        private readonly DapperContext _context;

        public UtilisateurCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterUtilisateurCoreAsync(UtilisateurCore utilisateurCore)
        {
            try
            {
                // Hash the password if provided
                if (!string.IsNullOrEmpty(utilisateurCore.MotDePasse))
                {
                    utilisateurCore.MotDePasse = Commun.SecurityUtils.HashPassword(utilisateurCore.MotDePasse);
                }

                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(Constants.Ps_Utilisateur_i,
                        UtilisateurCoreMapper.GetParameters(utilisateurCore),
                        commandType: CommandType.StoredProcedure);
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierUtilisateurCoreAsync(UtilisateurCore utilisateurCore)
        {
            try
            {
                // Hash the password if provided and not already hashed
                if (!string.IsNullOrEmpty(utilisateurCore.MotDePasse))
                {
                    utilisateurCore.MotDePasse = Commun.SecurityUtils.HashPassword(utilisateurCore.MotDePasse);
                }

                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(Constants.Ps_Utilisateur_u,
                        UtilisateurCoreMapper.GetParameters(utilisateurCore),
                        commandType: CommandType.StoredProcedure);
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerUtilisateurCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Utilisateur_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_Utilisateur_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de suppression par condition : {ex.Message}");
            }
        }

        public async Task<UtilisateurCore> ObtenirUtilisateurCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<UtilisateurCore>
                        (Constants.Ps_Utilisateur_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de l'utilisateur par id : {ex.Message}");
            }
        }

        public async Task<UtilisateurCore> ObtenirUtilisateurCoreParEmailAsync(string email)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<UtilisateurCore>
                        (Constants.Ps_Utilisateur_s_ParEmail, new { email }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de l'utilisateur par email : {ex.Message}");
            }
        }

        public async Task<List<UtilisateurCore>> ListeUtilisateurCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<UtilisateurCore>
                        (Constants.Ps_Utilisateur_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste : {ex.Message}");
            }
        }

        public async Task<List<UtilisateurCore>> ListeUtilisateurCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<UtilisateurCore>
                        (Constants.Ps_Utilisateur_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeUtilisateurCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Utilisateur_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<UtilisateurCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<UtilisateurCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e : {ex.Message}");
            }
        }

        public async Task<ResultatPage<UtilisateurCore>> ListeUtilisateurCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_Utilisateur_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<UtilisateurCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<UtilisateurCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Probl�me de r�cup�ration pagin�e par condition : {ex.Message}");
            }
        }
    }
}
