using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [Route("api/logs")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private static readonly List<ConnectionLog> _connectionLogs = new();
        private static readonly List<ApiLog> _apiLogs = new();
        private static readonly List<AnomalyLog> _anomalyLogs = new();
        private readonly ILogger<LogsController> _logger;

        public LogsController(ILogger<LogsController> logger)
        {
            _logger = logger;
            if (!_connectionLogs.Any())
            {
                _connectionLogs.Add(new ConnectionLog { Id = "1", UserEmail = "admin@gestprojet.com", IpAddress = "192.168.1.10", Action = "login", Timestamp = DateTime.UtcNow.AddHours(-1) });
                _connectionLogs.Add(new ConnectionLog { Id = "2", UserEmail = "admin@gestprojet.com", IpAddress = "192.168.1.10", Action = "logout", Timestamp = DateTime.UtcNow.AddMinutes(-30) });
                _connectionLogs.Add(new ConnectionLog { Id = "3", UserEmail = "chef@softpro.com", IpAddress = "192.168.1.15", Action = "login", Timestamp = DateTime.UtcNow.AddHours(-2) });
            }
            if (!_apiLogs.Any())
            {
                _apiLogs.Add(new ApiLog { Id = "1", Method = "GET", Path = "/api/societes", StatusCode = 200, DurationMs = 45, Timestamp = DateTime.UtcNow.AddMinutes(-5) });
                _apiLogs.Add(new ApiLog { Id = "2", Method = "POST", Path = "/api/utilisateurs", StatusCode = 201, DurationMs = 120, Timestamp = DateTime.UtcNow.AddMinutes(-10) });
                _apiLogs.Add(new ApiLog { Id = "3", Method = "GET", Path = "/api/projets", StatusCode = 200, DurationMs = 89, Timestamp = DateTime.UtcNow.AddMinutes(-15) });
            }
            if (!_anomalyLogs.Any())
            {
                _anomalyLogs.Add(new AnomalyLog { Id = "1", Type = "failed_login", Message = "Multiple failed login attempts", IpAddress = "192.168.1.100", Timestamp = DateTime.UtcNow.AddHours(-3), Severity = "warning" });
                _anomalyLogs.Add(new AnomalyLog { Id = "2", Type = "rate_limit", Message = "Rate limit exceeded", IpAddress = "10.0.0.55", Timestamp = DateTime.UtcNow.AddHours(-1), Severity = "error" });
            }
        }

        [HttpGet("connexions")]
        public ActionResult<IEnumerable<ConnectionLog>> GetConnexions([FromQuery] int limit = 50)
        {
            return Ok(_connectionLogs.OrderByDescending(l => l.Timestamp).Take(limit));
        }

        [HttpGet("api")]
        public ActionResult<IEnumerable<ApiLog>> GetApiLogs([FromQuery] int limit = 100)
        {
            return Ok(_apiLogs.OrderByDescending(l => l.Timestamp).Take(limit));
        }

        [HttpGet("anomalies")]
        public ActionResult<IEnumerable<AnomalyLog>> GetAnomalies()
        {
            return Ok(_anomalyLogs.OrderByDescending(l => l.Timestamp));
        }

        [HttpPost("connexions")]
        public ActionResult<ConnectionLog> PostConnectionLog([FromBody] ConnectionLog log)
        {
            log.Id = (_connectionLogs.Count + 1).ToString();
            log.Timestamp = DateTime.UtcNow;
            _connectionLogs.Add(log);
            return Ok(log);
        }

        [HttpPost("api")]
        public ActionResult<ApiLog> PostApiLog([FromBody] ApiLog log)
        {
            log.Id = (_apiLogs.Count + 1).ToString();
            log.Timestamp = DateTime.UtcNow;
            _apiLogs.Add(log);
            return Ok(log);
        }
    }

    public class ConnectionLog
    {
        public string Id { get; set; } = "";
        public string UserEmail { get; set; } = "";
        public string IpAddress { get; set; } = "";
        public string Action { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }

    public class ApiLog
    {
        public string Id { get; set; } = "";
        public string Method { get; set; } = "";
        public string Path { get; set; } = "";
        public int StatusCode { get; set; }
        public long DurationMs { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class AnomalyLog
    {
        public string Id { get; set; } = "";
        public string Type { get; set; } = "";
        public string Message { get; set; } = "";
        public string IpAddress { get; set; } = "";
        public DateTime Timestamp { get; set; }
        public string Severity { get; set; } = "";
    }
}