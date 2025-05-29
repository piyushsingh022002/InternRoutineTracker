using InternRoutineTracker.API.Data;
using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternRoutineTracker.API.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ActivityLog>> GetAllAsync() =>
            await _context.ActivityLogs.ToListAsync();

        public async Task<List<ActivityLog>> GetByUserIdAsync(int userId) =>
            await _context.ActivityLogs
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

        public async Task<ActivityLog?> GetByIdAsync(int id) =>
            await _context.ActivityLogs.FindAsync(id);

        public async Task<ActivityLog?> GetByUserIdAndDateAsync(int userId, DateTime date)
        {
            var startOfDay = date.Date;
            var endOfDay = startOfDay.AddDays(1).AddTicks(-1);
            
            return await _context.ActivityLogs
                .FirstOrDefaultAsync(a => a.UserId == userId && 
                                     a.Date >= startOfDay && 
                                     a.Date <= endOfDay);
        }

        public async Task<ActivityLog> CreateAsync(ActivityLog activityLog)
        {
            _context.ActivityLogs.Add(activityLog);
            await _context.SaveChangesAsync();
            return activityLog;
        }

        public async Task UpdateAsync(int id, ActivityLog updatedActivityLog)
        {
            var activityLog = await _context.ActivityLogs.FindAsync(id);
            if (activityLog != null)
            {
                // Update properties
                activityLog.HasNote = updatedActivityLog.HasNote;
                activityLog.StreakCount = updatedActivityLog.StreakCount;
                
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveAsync(int id)
        {
            var activityLog = await _context.ActivityLogs.FindAsync(id);
            if (activityLog != null)
            {
                _context.ActivityLogs.Remove(activityLog);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetCurrentStreakAsync(int userId)
        {
            var userLogs = await _context.ActivityLogs
                .Where(a => a.UserId == userId && a.HasNote)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
            
            if (userLogs.Count == 0)
                return 0;
            
            var today = DateTime.UtcNow.Date;
            var streak = 0;
            var currentDate = today;
            
            foreach (var log in userLogs)
            {
                if (log.Date.Date == currentDate || log.Date.Date == currentDate.AddDays(-1))
                {
                    streak++;
                    currentDate = log.Date.Date;
                }
                else
                {
                    break;
                }
            }
            
            return streak;
        }

        public async Task<List<ActivityLog>> GetUserActivityForDateRangeAsync(int userId, DateTime startDate, DateTime endDate) =>
            await _context.ActivityLogs
                .Where(a => a.UserId == userId && 
                       a.Date >= startDate && 
                       a.Date <= endDate)
                .OrderBy(a => a.Date)
                .ToListAsync();
    }
}
