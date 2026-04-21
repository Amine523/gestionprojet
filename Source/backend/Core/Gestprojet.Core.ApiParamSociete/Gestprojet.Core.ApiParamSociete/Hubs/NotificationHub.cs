using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var societeId = Context.User?.FindFirst("societeId")?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation("User {UserId} connected to notification hub", userId);
            }

            if (!string.IsNullOrEmpty(societeId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"societe_{societeId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation("User {UserId} disconnected from notification hub", userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SubscribeToProject(string projectId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"project_{projectId}");
            _logger.LogInformation("User subscribed to project {ProjectId}", projectId);
        }

        public async Task UnsubscribeFromProject(string projectId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"project_{projectId}");
        }

        public async Task SubscribeToNotifications(string notificationType)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"notif_{notificationType}");
        }
    }
}