using InternRoutineTracker.API.Models;

namespace InternRoutineTracker.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetAllAsync();
        Task<List<Notification>> GetByUserIdAsync(int userId);
        Task<Notification?> GetByIdAsync(int id);
        Task<Notification> CreateAsync(Notification notification);
        Task UpdateAsync(int id, Notification notification);
        Task RemoveAsync(int id);
        Task MarkAsReadAsync(int id);
        Task MarkAllAsReadAsync(int userId);
        Task<int> GetUnreadCountAsync(int userId);
    }
}
