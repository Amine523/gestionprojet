using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using System.Data;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure;

public class TestCoreRepository : ITestCoreRepository
{
    private readonly DapperContext _context;

    public TestCoreRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TestCore>> GetAllTestsAsync(string idSociete)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TestCore>(
            Constants.Ps_Test_s_ParSociete,
            new { IdSociete = idSociete },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<TestCore?> GetTestByIdAsync(string id)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<TestCore>(
            Constants.Ps_Test_s_ParId,
            new { Id = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> CreateTestAsync(TestCore test)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Test_i,
            new
            {
                test.Id,
                test.Titre,
                test.Description,
                test.TypeTest,
                test.DureeMinutes,
                test.ScoreMinimum,
                test.SocieteId,
                test.CreeParId,
                test.Poste,
                test.Actif,
                test.DateCreation
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> UpdateTestAsync(TestCore test)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Test_u,
            new
            {
                test.Id,
                test.Titre,
                test.Description,
                test.TypeTest,
                test.DureeMinutes,
                test.ScoreMinimum,
                test.Actif
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> DeleteTestAsync(string id)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Test_d,
            new { Id = id },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<IEnumerable<QuestionCore>> GetQuestionsByTestIdAsync(string testId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<QuestionCore>(
            Constants.Ps_Question_s_ParTest,
            new { TestId = testId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> CreateQuestionAsync(QuestionCore question)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Question_i,
            new
            {
                question.Id,
                question.TestId,
                question.Texte,
                question.TypeQuestion,
                question.Points,
                question.Ordre,
                question.Actif
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> UpdateQuestionAsync(QuestionCore question)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Question_u,
            new
            {
                question.Id,
                question.Texte,
                question.TypeQuestion,
                question.Points,
                question.Ordre,
                question.Actif
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> DeleteQuestionAsync(string id)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Question_d,
            new { Id = id },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<IEnumerable<ReponseCore>> GetReponsesByQuestionIdAsync(string questionId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<ReponseCore>(
            Constants.Ps_Reponse_s_ParQuestion,
            new { QuestionId = questionId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> CreateReponseAsync(ReponseCore reponse)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Reponse_i,
            new
            {
                reponse.Id,
                reponse.QuestionId,
                reponse.Texte,
                reponse.EstCorrecte,
                reponse.Ordre
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> UpdateReponseAsync(ReponseCore reponse)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Reponse_u,
            new
            {
                reponse.Id,
                reponse.Texte,
                reponse.EstCorrecte,
                reponse.Ordre
            },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<bool> DeleteReponseAsync(string id)
    {
        using var connection = _context.CreateConnection();
        var result = await connection.ExecuteAsync(
            Constants.Ps_Reponse_d,
            new { Id = id },
            commandType: CommandType.StoredProcedure);
        return result > 0;
    }

    public async Task<IEnumerable<TestResultCore>> GetResultsByTestIdAsync(string testId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TestResultCore>(
            Constants.Ps_TestResult_s_ParTest,
            new { TestId = testId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<TestResultCore>> GetResultsByEmployeeIdAsync(string employeeId)
    {
        using var connection = _context.CreateConnection();
        return await connection.QueryAsync<TestResultCore>(
            Constants.Ps_TestResult_s_ParUtilisateur,
            new { EmployeeId = employeeId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<bool> CreateTestResultAsync(TestResultCore result)
    {
        using var connection = _context.CreateConnection();
        var rows = await connection.ExecuteAsync(
            Constants.Ps_TestResult_i,
            new
            {
                result.Id,
                result.TestId,
                result.UtilisateurId,
                result.ApplicationId,
                result.Score,
                result.Pourcentage,
                result.EstPasse,
                result.TempsEcouleMinutes,
                result.DateDebut,
                result.DateFin,
                result.ReponsesJson,
                result.DateCreation
            },
            commandType: CommandType.StoredProcedure);
        return rows > 0;
    }
}