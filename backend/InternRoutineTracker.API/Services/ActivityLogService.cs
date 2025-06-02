using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;
using InternRoutineTracker.API.Repositories.Interfaces;
using InternRoutineTracker.API.Services.Interfaces;

namespace InternRoutineTracker.API.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;

        public ActivityLogService(IActivityLogRepository activityLogRepository)
        {
            _activityLogRepository = activityLogRepository;
        }

        public async Task<List<ActivityLogDTO>> GetUserActivityLogsAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            var activityLogs = await _activityLogRepository.GetByUserIdAsync(userIdInt);
            return activityLogs.Select(MapToActivityLogDto).ToList();
        }

        public async Task<ActivityLogDTO?> GetUserActivityForDateAsync(string userId, DateTime date)
        {
            int userIdInt = int.Parse(userId);
            var activityLog = await _activityLogRepository.GetByUserIdAndDateAsync(userIdInt, date);
            return activityLog != null ? MapToActivityLogDto(activityLog) : null;
        }

        public async Task<int> GetCurrentStreakAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            return await _activityLogRepository.GetCurrentStreakAsync(userIdInt);
        }

        public async Task<List<ActivityLogDTO>> GetUserActivityForDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
        {
            int userIdInt = int.Parse(userId);
            var activityLogs = await _activityLogRepository.GetUserActivityForDateRangeAsync(userIdInt, startDate, endDate);
            return activityLogs.Select(MapToActivityLogDto).ToList();
        }

        private static ActivityLogDTO MapToActivityLogDto(ActivityLog activityLog)
        {
            return new ActivityLogDTO
            {
                Id = activityLog.Id.ToString(),
                UserId = activityLog.UserId.ToString(),
                Date = activityLog.Date,
                HasNote = activityLog.HasNote,
                StreakCount = activityLog.StreakCount
            };
        }
    }
}
