using Microsoft.AspNetCore.SignalR;
using Gestprojet.Metier.ApiParamSociete.WebApi.Hubs;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public interface INotificationService
    {
        Task SendToUserAsync(string userId, string title, string message, string type = "info");
        Task SendToSocieteAsync(string societeId, string title, string message, string type = "info");
        Task SendToProjectAsync(string projectId, string title, string message, string type = "info");
        Task SendToAllAsync(string title, string message, string type = "info");
        Task SendNotificationAsync(NotificationDto notification);
    }

    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            IHubContext<NotificationHub> hubContext,
            ILogger<NotificationService> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task SendToUserAsync(string userId, string title, string message, string type = "info")
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Title = title,
                Message = message,
                Type = type,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", notification);
            _logger.LogInformation("Notification sent to user {UserId}: {Title}", userId, title);
        }

        public async Task SendToSocieteAsync(string societeId, string title, string message, string type = "info")
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Title = title,
                Message = message,
                Type = type,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.Group($"societe_{societeId}").SendAsync("ReceiveNotification", notification);
            _logger.LogInformation("Notification sent to societe {SocieteId}: {Title}", societeId, title);
        }

        public async Task SendToProjectAsync(string projectId, string title, string message, string type = "info")
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Title = title,
                Message = message,
                Type = type,
                Timestamp = DateTime.UtcNow,
                ProjectId = projectId
            };

            await _hubContext.Clients.Group($"project_{projectId}").SendAsync("ReceiveNotification", notification);
            _logger.LogInformation("Notification sent to project {ProjectId}: {Title}", projectId, title);
        }

        public async Task SendToAllAsync(string title, string message, string type = "info")
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid().ToString(),
                Title = title,
                Message = message,
                Type = type,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
            _logger.LogInformation("Broadcast notification sent: {Title}", title);
        }

        public async Task SendNotificationAsync(NotificationDto notification)
        {
            notification.Id = Guid.NewGuid().ToString();
            notification.Timestamp = DateTime.UtcNow;

            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
        }
    }

    public class NotificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "info";
        public DateTime Timestamp { get; set; }
        public string? UserId { get; set; }
        public string? SocieteId { get; set; }
        public string? ProjectId { get; set; }
        public string? ActionUrl { get; set; }
    }
}