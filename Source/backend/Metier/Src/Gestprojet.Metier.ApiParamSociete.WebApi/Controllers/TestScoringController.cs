using Microsoft.AspNetCore.Mvc;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestScoringController : ControllerBase
{
    private readonly ILogger<TestScoringController> _logger;

    public TestScoringController(ILogger<TestScoringController> logger)
    {
        _logger = logger;
    }

    [HttpGet("liste")]
    public IActionResult GetTests()
    {
        return Ok(new[] { 
            new { id = "TEST001", titre = "Test Technique JavaScript", description = "Évaluation des connaissances JS", nombreQuestions = 20 },
            new { id = "TEST002", titre = "Test法", description = "Évaluation des connaissances法", nombreQuestions = 15 }
        });
    }

    [HttpGet("{id}")]
    public IActionResult GetTest(string id)
    {
        return Ok(new { id = id, titre = "Test", questions = new object[] { } });
    }

    [HttpPost("submit")]
    public IActionResult SubmitTest([FromBody] TestSubmission submission)
    {
        _logger.LogInformation("Test {TestId} submitted by user {UserId}", submission.TestId, submission.UserId);
        
        var response = new 
        {
            testId = submission.TestId,
            userId = submission.UserId,
            score = 0,
            maxScore = 100,
            percentage = 0,
            passed = false,
            message = "API de scoring en cours d'implémentation"
        };
        
        return Ok(response);
    }

    [HttpGet("{testId}/classement")]
    public IActionResult GetClassement(string testId)
    {
        return Ok(new 
        {
            testId = testId,
            totalParticipants = 0,
            averageScore = 0,
            passRate = 0,
            message = "Classement en cours d'implémentation"
        });
    }
}

public class TestSubmission
{
    public string TestId { get; set; } = "";
    public string UserId { get; set; } = "";
    public double PassingScore { get; set; } = 60;
    public List<AnswerSubmission>? Answers { get; set; }
}

public class AnswerSubmission
{
    public string QuestionId { get; set; } = "";
    public List<string>? SelectedReponseIds { get; set; }
    public string? TextAnswer { get; set; }
}