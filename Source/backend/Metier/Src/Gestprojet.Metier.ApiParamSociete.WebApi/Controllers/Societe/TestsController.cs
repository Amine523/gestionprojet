using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestsController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _coreApiUrl;

        public TestsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _coreApiUrl = configuration.GetSection("URL").GetValue<string>("ApiParamSociete") ?? "http://localhost:5050";
        }

        private HttpClient GetClient() => _httpClientFactory.CreateClient("ApiParamSociete");

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await GetClient().GetAsync($"{_coreApiUrl}/api/Tests");
                if (!response.IsSuccessStatusCode)
                {
                    System.Console.WriteLine($"[METIER] Tests.GetAll failed: {response.StatusCode}");
                    return StatusCode((int)response.StatusCode);
                }
                return Ok(await response.Content.ReadFromJsonAsync<List<object>>());
            }
            catch (Exception ex)
            {
                System.Console.WriteLine($"[METIER] Tests.GetAll error: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var response = await GetClient().GetAsync($"{_coreApiUrl}/api/Tests/{id}");
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] object test)
        {
            try
            {
                var response = await GetClient().PostAsJsonAsync($"{_coreApiUrl}/api/Tests", test);
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] object test)
        {
            try
            {
                var response = await GetClient().PutAsJsonAsync($"{_coreApiUrl}/api/Tests/{id}", test);
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var response = await GetClient().DeleteAsync($"{_coreApiUrl}/api/Tests/{id}");
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{testId}/questions")]
        public async Task<IActionResult> GetQuestions(string testId)
        {
            try
            {
                var response = await GetClient().GetAsync($"{_coreApiUrl}/api/Tests/{testId}/questions");
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<List<object>>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("questions")]
        public async Task<IActionResult> CreateQuestion([FromBody] object question)
        {
            try
            {
                var response = await GetClient().PostAsJsonAsync($"{_coreApiUrl}/api/Tests/questions", question);
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("reponses")]
        public async Task<IActionResult> CreateReponse([FromBody] object reponse)
        {
            try
            {
                var response = await GetClient().PostAsJsonAsync($"{_coreApiUrl}/api/Tests/reponses", reponse);
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<object>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
