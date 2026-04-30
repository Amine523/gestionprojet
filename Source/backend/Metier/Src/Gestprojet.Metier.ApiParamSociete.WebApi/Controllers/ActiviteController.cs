using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActiviteController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _coreApiUrl;

        public ActiviteController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
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
                var response = await GetClient().GetAsync($"{_coreApiUrl}/api/Activite");
                if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode);
                return Ok(await response.Content.ReadFromJsonAsync<List<object>>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] object activite)
        {
            try
            {
                var response = await GetClient().PostAsJsonAsync($"{_coreApiUrl}/api/Activite", activite);
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
