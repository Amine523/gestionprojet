using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Microsoft.AspNetCore.SignalR;
using Gestprojet.Core.ApiParamSociete.WebApi.Hubs;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationCoreBusiness _business;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationCoreBusiness business, 
            IHubContext<NotificationHub> hubContext,
            ILogger<NotificationsController> logger)
        {
            _business = business;
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationCore>>> GetNotifications()
        {
            try
            {
                var list = await _business.ListeNotificationCoreAsync();
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching notifications");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<NotificationCore>>> GetUserNotifications(string userId)
        {
            try
            {
                var critere = new CritereRecherche { UtilisateurId = userId };
                var list = await _business.ListeNotificationCoreParConditionAsync(critere);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user notifications");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<bool>> PostNotification(NotificationCore notification)
        {
            try
            {
                var result = await _business.AjouterNotificationCoreAsync(notification);
                if (result)
                {
                    // Real-time notification via SignalR
                    if (!string.IsNullOrEmpty(notification.UtilisateurId))
                    {
                        await _hubContext.Clients.Group($"user_{notification.UtilisateurId}").SendAsync("ReceiveNotification", notification);
                    }
                    else
                    {
                        await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
                    }
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("send-to-user")]
        public async Task<IActionResult> SendToUser([FromBody] SendToUserRequest request)
        {
            try
            {
                var notification = new NotificationCore
                {
                    UtilisateurId = request.UserId,
                    Titre = request.Title,
                    Contenu = request.Message,
                    EstLu = false,
                    DateCreation = DateTime.Now
                };

                await _business.AjouterNotificationCoreAsync(notification);
                await _hubContext.Clients.Group($"user_{request.UserId}").SendAsync("ReceiveNotification", notification);
                
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to user");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("send-to-societe")]
        public async Task<IActionResult> SendToSociete([FromBody] SendToSocieteRequest request)
        {
            try
            {
                await _hubContext.Clients.Group($"societe_{request.SocieteId}").SendAsync("ReceiveNotification", new {
                    Titre = request.Title,
                    Contenu = request.Message,
                    DateCreation = DateTime.Now
                });
                
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification to societe");
                return StatusCode(500, ex.Message);
            }
        }
    }

    public class SendToUserRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class SendToSocieteRequest
    {
        public string SocieteId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
