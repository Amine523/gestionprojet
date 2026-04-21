using Gestprojet.Core.ApiParamSociete.Domain.Models;
using System.Collections.Generic;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

public interface ITestCoreBusiness
{
    Task<IEnumerable<TestCore>> GetAllTestsAsync(string idSociete);
    Task<TestCore?> GetTestByIdAsync(string id);
    Task<bool> CreateTestAsync(TestCore test);
    Task<bool> UpdateTestAsync(TestCore test);
    Task<bool> DeleteTestAsync(string id);
    Task<IEnumerable<QuestionCore>> GetQuestionsByTestIdAsync(string testId);
    Task<bool> CreateQuestionAsync(QuestionCore question);
    Task<bool> UpdateQuestionAsync(QuestionCore question);
    Task<bool> DeleteQuestionAsync(string id);
    Task<IEnumerable<ReponseCore>> GetReponsesByQuestionIdAsync(string questionId);
    Task<bool> CreateReponseAsync(ReponseCore reponse);
    Task<bool> UpdateReponseAsync(ReponseCore reponse);
    Task<bool> DeleteReponseAsync(string id);
    Task<IEnumerable<TestResultCore>> GetResultsByTestIdAsync(string testId);
    Task<IEnumerable<TestResultCore>> GetResultsByEmployeeIdAsync(string employeeId);
    Task<bool> CreateTestResultAsync(TestResultCore result);
}