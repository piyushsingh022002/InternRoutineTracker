using InternRoutineTracker.API.Services.Interfaces;

namespace InternRoutineTracker.API.Services.BackgroundServices
{
    public class NotificationCheckService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NotificationCheckService> _logger;
        private readonly TimeSpan _checkInterval;

        public NotificationCheckService(
            IServiceProvider serviceProvider,
            ILogger<NotificationCheckService> logger,
            IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            
            // Default to checking once a day at midnight
            int intervalHours = configuration.GetValue<int>("NotificationCheck:IntervalHours", 24);
            _checkInterval = TimeSpan.FromHours(intervalHours);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Notification Check Service is starting");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Checking for missed notes at: {time}", DateTimeOffset.Now);
                    
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                        await notificationService.CheckAndCreateMissedNoteNotificationsAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while checking for missed notes");
                }

                // Wait for the next check interval
                await Task.Delay(_checkInterval, stoppingToken);
            }

            _logger.LogInformation("Notification Check Service is stopping");
        }
    }
}
