using InternRoutineTracker.API.Models;

namespace InternRoutineTracker.API.Repositories.Interfaces
{
    public interface IActivityLogRepository
    {
        Task<List<ActivityLog>> GetAllAsync();
        Task<List<ActivityLog>> GetByUserIdAsync(int userId);
        Task<ActivityLog?> GetByIdAsync(int id);
        Task<ActivityLog?> GetByUserIdAndDateAsync(int userId, DateTime date);
        Task<ActivityLog> CreateAsync(ActivityLog activityLog);
        Task UpdateAsync(int id, ActivityLog activityLog);
        Task RemoveAsync(int id);
        Task<int> GetCurrentStreakAsync(int userId);
        Task<List<ActivityLog>> GetUserActivityForDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
