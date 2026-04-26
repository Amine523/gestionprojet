using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class DemandeCongeCoreRepository : IDemandeCongeCoreRepository
    {
        private readonly DapperContext _context;

        public DemandeCongeCoreRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> AjouterDemandeCongeCoreAsync(DemandeCongeCore demandeCongeCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_DemandeConge_i, new {
                            id = demandeCongeCore.Id,
                            utilisateurId = demandeCongeCore.UtilisateurId,
                            typePointageId = demandeCongeCore.TypePointageId,
                            dateDebut = demandeCongeCore.DateDebut,
                            dateFin = demandeCongeCore.DateFin,
                            status = demandeCongeCore.Status,
                            motif = demandeCongeCore.Motif,
                            valideParId = demandeCongeCore.ValideParId
                        }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème d'ajout : {ex.Message}");
            }
        }

        public async Task<bool> ModifierDemandeCongeCoreAsync(DemandeCongeCore demandeCongeCore)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_DemandeConge_u, new {
                            id = demandeCongeCore.Id,
                            utilisateurId = demandeCongeCore.UtilisateurId,
                            typePointageId = demandeCongeCore.TypePointageId,
                            dateDebut = demandeCongeCore.DateDebut,
                            dateFin = demandeCongeCore.DateFin,
                            status = demandeCongeCore.Status,
                            motif = demandeCongeCore.Motif,
                            valideParId = demandeCongeCore.ValideParId
                        }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de modification : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerDemandeCongeCoreAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_DemandeConge_d, new { id }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de suppression : {ex.Message}");
            }
        }

        public async Task<bool> SupprimerDemandeCongeCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var response = await connection.QueryFirstOrDefaultAsync<int>
                        (Constants.Ps_DemandeConge_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
                    return response > 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de suppression par condition : {ex.Message}");
            }
        }

        public async Task<DemandeCongeCore> ObtenirDemandeCongeCoreParIdAsync(string id)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    return await connection.QueryFirstOrDefaultAsync<DemandeCongeCore>
                        (Constants.Ps_DemandeConge_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération : {ex.Message}");
            }
        }

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeCoreAsync()
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<DemandeCongeCore>
                        (Constants.Ps_DemandeConge_s_Liste, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste : {ex.Message}");
            }
        }

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeCoreParConditionAsync(CritereRecherche critereRecherche)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    var result = await connection.QueryAsync<DemandeCongeCore>
                        (Constants.Ps_DemandeConge_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
                    return result.AsList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération de la liste par condition : {ex.Message}");
            }
        }

        public async Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeCoreParPageAsync(int pageNumero, int pageTaille)
        {
            try
            {
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_DemandeConge_s_Liste_Page,
                        new { PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<DemandeCongeCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<DemandeCongeCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération paginée : {ex.Message}");
            }
        }

        public async Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille)
        {
            try
            {
                string condition = SoftProExtensions.ToSqlCondition(critereRecherche);
                using (var connection = _context.CreateConnection())
                {
                    using var multi = await connection.QueryMultipleAsync(
                        Constants.Ps_DemandeConge_s_Liste_ParCondition_Page,
                        new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille },
                        commandType: CommandType.StoredProcedure);
                    var data = (await multi.ReadAsync<DemandeCongeCore>()).AsList();
                    var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
                    return new ResultatPage<DemandeCongeCore> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Problème de récupération paginée par condition : {ex.Message}");
            }
        }
    }
}
