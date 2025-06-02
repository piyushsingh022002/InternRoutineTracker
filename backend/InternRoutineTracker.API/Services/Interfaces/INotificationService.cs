using InternRoutineTracker.API.Models.DTOs;

namespace InternRoutineTracker.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDTO>> GetUserNotificationsAsync(string userId);
        Task<NotificationDTO> GetNotificationByIdAsync(string id, string userId);
        Task<NotificationDTO> CreateNotificationAsync(string userId, string message);
        Task MarkAsReadAsync(string id, string userId);
        Task MarkAllAsReadAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task CheckAndCreateMissedNoteNotificationsAsync();
    }
}
