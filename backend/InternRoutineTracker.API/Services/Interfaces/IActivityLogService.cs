using InternRoutineTracker.API.Models.DTOs;

namespace InternRoutineTracker.API.Services.Interfaces
{
    public interface IActivityLogService
    {
        Task<List<ActivityLogDTO>> GetUserActivityLogsAsync(string userId);
        Task<ActivityLogDTO?> GetUserActivityForDateAsync(string userId, DateTime date);
        Task<int> GetCurrentStreakAsync(string userId);
        Task<List<ActivityLogDTO>> GetUserActivityForDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
    }
}
