using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [Route("api/blocked-ips")]
    [ApiController]
    public class BlockedIpController : ControllerBase
    {
        private static readonly List<BlockedIp> _blockedIps = new();
        private readonly ILogger<BlockedIpController> _logger;

        public BlockedIpController(ILogger<BlockedIpController> logger)
        {
            _logger = logger;
            if (!_blockedIps.Any())
            {
                _blockedIps.Add(new BlockedIp { Id = "1", IpAddress = "192.168.1.100", Reason = "Tentatives de brute force", BlockedAt = DateTime.UtcNow.AddDays(-2), IsPermanent = false });
                _blockedIps.Add(new BlockedIp { Id = "2", IpAddress = "10.0.0.55", Reason = "Suspicious activity", BlockedAt = DateTime.UtcNow.AddDays(-1), IsPermanent = true });
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<BlockedIp>> Get()
        {
            return Ok(_blockedIps);
        }

        [HttpPost]
        public ActionResult<BlockedIp> Post([FromBody] BlockedIp ip)
        {
            ip.Id = (_blockedIps.Count + 1).ToString();
            ip.BlockedAt = DateTime.UtcNow;
            _blockedIps.Add(ip);
            return Ok(ip);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var ip = _blockedIps.FirstOrDefault(i => i.Id == id);
            if (ip != null)
            {
                _blockedIps.Remove(ip);
                return Ok();
            }
            return NotFound();
        }
    }

    public class BlockedIp
    {
        public string Id { get; set; } = "";
        public string IpAddress { get; set; } = "";
        public string Reason { get; set; } = "";
        public DateTime BlockedAt { get; set; }
        public bool IsPermanent { get; set; }
    }
}
