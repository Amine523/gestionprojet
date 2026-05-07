using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Application;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestsController : ControllerBase
{
    private readonly ITestCoreBusiness _business;

    public TestsController(ITestCoreBusiness business)
    {
        _business = business;
    }

    [HttpGet("societe/{idSociete}")]
    public async Task<IActionResult> GetAllBySociete(string idSociete)
    {
        var result = await _business.GetAllTestsAsync(idSociete);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _business.GetTestByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TestCore test)
    {
        var success = await _business.CreateTestAsync(test);
        return Ok(success);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] TestCore test)
    {
        test.Id = id;
        var result = await _business.UpdateTestAsync(test);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _business.DeleteTestAsync(id);
        return Ok(result);
    }

    [HttpGet("{testId}/questions")]
    public async Task<IActionResult> GetQuestions(string testId)
    {
        var result = await _business.GetQuestionsByTestIdAsync(testId);
        return Ok(result);
    }

    [HttpPost("questions")]
    public async Task<IActionResult> CreateQuestion([FromBody] QuestionCore question)
    {
        var success = await _business.CreateQuestionAsync(question);
        return Ok(success);
    }

    [HttpPut("questions/{id}")]
    public async Task<IActionResult> UpdateQuestion(string id, [FromBody] QuestionCore question)
    {
        question.Id = id;
        var result = await _business.UpdateQuestionAsync(question);
        return Ok(result);
    }

    [HttpDelete("questions/{id}")]
    public async Task<IActionResult> DeleteQuestion(string id)
    {
        var result = await _business.DeleteQuestionAsync(id);
        return Ok(result);
    }

    [HttpGet("questions/{questionId}/reponses")]
    public async Task<IActionResult> GetReponses(string questionId)
    {
        var result = await _business.GetReponsesByQuestionIdAsync(questionId);
        return Ok(result);
    }

    [HttpPost("reponses")]
    public async Task<IActionResult> CreateReponse([FromBody] ReponseCore reponse)
    {
        var success = await _business.CreateReponseAsync(reponse);
        return Ok(success);
    }

    [HttpPut("reponses/{id}")]
    public async Task<IActionResult> UpdateReponse(string id, [FromBody] ReponseCore reponse)
    {
        reponse.Id = id;
        var result = await _business.UpdateReponseAsync(reponse);
        return Ok(result);
    }

    [HttpDelete("reponses/{id}")]
    public async Task<IActionResult> DeleteReponse(string id)
    {
        var result = await _business.DeleteReponseAsync(id);
        return Ok(result);
    }

    [HttpGet("{testId}/results")]
    public async Task<IActionResult> GetResultsByTest(string testId)
    {
        var result = await _business.GetResultsByTestIdAsync(testId);
        return Ok(result);
    }

    [HttpGet("employee/{employeeId}/results")]
    public async Task<IActionResult> GetResultsByEmployee(string employeeId)
    {
        var result = await _business.GetResultsByEmployeeIdAsync(employeeId);
        return Ok(result);
    }

    [HttpPost("results")]
    public async Task<IActionResult> CreateResult([FromBody] TestResultCore result)
    {
        var success = await _business.CreateTestResultAsync(result);
        return Ok(success);
    }
}
