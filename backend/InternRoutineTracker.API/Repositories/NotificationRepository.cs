using InternRoutineTracker.API.Data;
using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternRoutineTracker.API.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetAllAsync() =>
            await _context.Notifications.ToListAsync();

        public async Task<List<Notification>> GetByUserIdAsync(int userId) =>
            await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

        public async Task<Notification?> GetByIdAsync(int id) =>
            await _context.Notifications.FindAsync(id);

        public async Task<Notification> CreateAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task UpdateAsync(int id, Notification updatedNotification)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                // Update properties
                notification.Message = updatedNotification.Message;
                notification.IsRead = updatedNotification.IsRead;
                
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAsReadAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();
                
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }
            
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetUnreadCountAsync(int userId) =>
            await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
    }
}
