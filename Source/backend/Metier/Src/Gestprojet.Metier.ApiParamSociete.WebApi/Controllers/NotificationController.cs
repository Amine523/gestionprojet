using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(
            INotificationService notificationService,
            ILogger<NotificationController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                // Return an empty list for now to satisfy the frontend call
                // and avoid 404. Persistence is handled in the Core project.
                return Ok(new List<NotificationDto>());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching notifications");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationDto notification)
        {
            try
            {
                await _notificationService.SendNotificationAsync(notification);
                return Ok(new { success = true, message = "Notification sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("send-to-user")]
        public async Task<IActionResult> SendToUser([FromBody] SendToUserRequest request)
        {
            try
            {
                await _notificationService.SendToUserAsync(
                    request.UserId,
                    request.Title,
                    request.Message,
                    request.Type ?? "info");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to user");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("send-to-societe")]
        public async Task<IActionResult> SendToSociete([FromBody] SendToSocieteRequest request)
        {
            try
            {
                await _notificationService.SendToSocieteAsync(
                    request.SocieteId,
                    request.Title,
                    request.Message,
                    request.Type ?? "info");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to societe");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("send-to-project")]
        public async Task<IActionResult> SendToProject([FromBody] SendToProjectRequest request)
        {
            try
            {
                await _notificationService.SendToProjectAsync(
                    request.ProjectId,
                    request.Title,
                    request.Message,
                    request.Type ?? "info");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to project");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("broadcast")]
        public async Task<IActionResult> Broadcast([FromBody] BroadcastRequest request)
        {
            try
            {
                await _notificationService.SendToAllAsync(
                    request.Title,
                    request.Message,
                    request.Type ?? "info");
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting notification");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "ok", timestamp = DateTime.UtcNow });
        }
    }

    public class SendToUserRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Type { get; set; }
    }

    public class SendToSocieteRequest
    {
        public string SocieteId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Type { get; set; }
    }

    public class SendToProjectRequest
    {
        public string ProjectId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Type { get; set; }
    }

    public class BroadcastRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Type { get; set; }
    }
}
