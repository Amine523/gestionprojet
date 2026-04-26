using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class NotificationCoreRepository : INotificationCoreRepository
    {
        private readonly DapperContext _context;

        public NotificationCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterNotificationCoreAsync(NotificationCore notification)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(Constants.Ps_Notification_i,
                        NotificationCoreMapper.GetParameters(notification),
                        commandType: CommandType.StoredProcedure);
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierNotificationCoreAsync(NotificationCore notification)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    await connection.ExecuteAsync(Constants.Ps_Notification_u,
                        NotificationCoreMapper.GetParameters(notification),
                        commandType: CommandType.StoredProcedure);
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerNotificationCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.ExecuteAsync
                        (Constants.Ps_Notification_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de suppression : {ex.Message}");
            }
        }

        public async Task<NotificationCore> ObtenirNotificationCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<NotificationCore>
                        (Constants.Ps_Notification_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération : {ex.Message}");
            }
        }

        public async Task<List<NotificationCore>> ListeNotificationCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<NotificationCore>
                        (Constants.Ps_Notification_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste : {ex.Message}");
            }
        }

        public async Task<List<NotificationCore>> ListeNotificationCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<NotificationCore>
                        (Constants.Ps_Notification_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste par condition : {ex.Message}");
            }
        }
    }
}
