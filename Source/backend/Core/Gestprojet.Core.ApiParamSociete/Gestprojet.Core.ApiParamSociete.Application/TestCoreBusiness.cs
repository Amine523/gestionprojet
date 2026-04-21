using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Infrastructure;

namespace Gestprojet.Core.ApiParamSociete.Application;

public class TestCoreBusiness : ITestCoreBusiness
{
    private readonly ITestCoreRepository _repository;

    public TestCoreBusiness(ITestCoreRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TestCore>> GetAllTestsAsync(string idSociete)
    {
        return await _repository.GetAllTestsAsync(idSociete);
    }

    public async Task<TestCore?> GetTestByIdAsync(string id)
    {
        return await _repository.GetTestByIdAsync(id);
    }

    public async Task<bool> CreateTestAsync(TestCore test)
    {
        return await _repository.CreateTestAsync(test);
    }

    public async Task<bool> UpdateTestAsync(TestCore test)
    {
        return await _repository.UpdateTestAsync(test);
    }

    public async Task<bool> DeleteTestAsync(string id)
    {
        return await _repository.DeleteTestAsync(id);
    }

    public async Task<IEnumerable<QuestionCore>> GetQuestionsByTestIdAsync(string testId)
    {
        return await _repository.GetQuestionsByTestIdAsync(testId);
    }

    public async Task<bool> CreateQuestionAsync(QuestionCore question)
    {
        return await _repository.CreateQuestionAsync(question);
    }

    public async Task<bool> UpdateQuestionAsync(QuestionCore question)
    {
        return await _repository.UpdateQuestionAsync(question);
    }

    public async Task<bool> DeleteQuestionAsync(string id)
    {
        return await _repository.DeleteQuestionAsync(id);
    }

    public async Task<IEnumerable<ReponseCore>> GetReponsesByQuestionIdAsync(string questionId)
    {
        return await _repository.GetReponsesByQuestionIdAsync(questionId);
    }

    public async Task<bool> CreateReponseAsync(ReponseCore reponse)
    {
        return await _repository.CreateReponseAsync(reponse);
    }

    public async Task<bool> UpdateReponseAsync(ReponseCore reponse)
    {
        return await _repository.UpdateReponseAsync(reponse);
    }

    public async Task<bool> DeleteReponseAsync(string id)
    {
        return await _repository.DeleteReponseAsync(id);
    }

    public async Task<IEnumerable<TestResultCore>> GetResultsByTestIdAsync(string testId)
    {
        return await _repository.GetResultsByTestIdAsync(testId);
    }

    public async Task<IEnumerable<TestResultCore>> GetResultsByEmployeeIdAsync(string employeeId)
    {
        return await _repository.GetResultsByEmployeeIdAsync(employeeId);
    }

    public async Task<bool> CreateTestResultAsync(TestResultCore result)
    {
        return await _repository.CreateTestResultAsync(result);
    }
}