using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;
using InternRoutineTracker.API.Repositories.Interfaces;
using InternRoutineTracker.API.Services.Interfaces;

namespace InternRoutineTracker.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IActivityLogRepository _activityLogRepository;

        public NotificationService(
            INotificationRepository notificationRepository,
            IUserRepository userRepository,
            IActivityLogRepository activityLogRepository)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
            _activityLogRepository = activityLogRepository;
        }

        public async Task<List<NotificationDTO>> GetUserNotificationsAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            var notifications = await _notificationRepository.GetByUserIdAsync(userIdInt);
            return notifications.Select(MapToNotificationDto).ToList();
        }

        public async Task<NotificationDTO> GetNotificationByIdAsync(string id, string userId)
        {
            int idInt = int.Parse(id);
            int userIdInt = int.Parse(userId);
            var notification = await _notificationRepository.GetByIdAsync(idInt);
            
            if (notification == null)
            {
                throw new ApplicationException("Notification not found");
            }
            
            if (notification.UserId != userIdInt)
            {
                throw new ApplicationException("You don't have permission to access this notification");
            }
            
            return MapToNotificationDto(notification);
        }

        public async Task<NotificationDTO> CreateNotificationAsync(string userId, string message)
        {
            int userIdInt = int.Parse(userId);
            var notification = new Notification
            {
                UserId = userIdInt,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            
            await _notificationRepository.CreateAsync(notification);
            
            return MapToNotificationDto(notification);
        }

        public async Task MarkAsReadAsync(string id, string userId)
        {
            int idInt = int.Parse(id);
            int userIdInt = int.Parse(userId);
            var notification = await _notificationRepository.GetByIdAsync(idInt);
            
            if (notification == null)
            {
                throw new ApplicationException("Notification not found");
            }
            
            if (notification.UserId != userIdInt)
            {
                throw new ApplicationException("You don't have permission to update this notification");
            }
            
            await _notificationRepository.MarkAsReadAsync(idInt);
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            await _notificationRepository.MarkAllAsReadAsync(userIdInt);
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            return await _notificationRepository.GetUnreadCountAsync(userIdInt);
        }

        public async Task CheckAndCreateMissedNoteNotificationsAsync()
        {
            // Get all users
            var users = await _userRepository.GetAllAsync();
            
            // Get yesterday's date
            var yesterday = DateTime.UtcNow.Date.AddDays(-1);
            
            foreach (var user in users)
            {
                // Check if user has activity log for yesterday
                var activityLog = await _activityLogRepository.GetByUserIdAndDateAsync(user.Id, yesterday);
                
                // If no activity log or no note was created yesterday
                if (activityLog == null || !activityLog.HasNote)
                {
                    // Create a notification for the user
                    var message = "You missed creating a note yesterday. Keep up your streak by creating a note today!";
                    await CreateNotificationAsync(user.Id.ToString(), message);
                }
            }
        }

        private static NotificationDTO MapToNotificationDto(Notification notification)
        {
            return new NotificationDTO
            {
                Id = notification.Id.ToString(),
                UserId = notification.UserId.ToString(),
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }
    }
}
