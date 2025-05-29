namespace InternRoutineTracker.API.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string UsersCollectionName { get; set; } = string.Empty;
        public string NotesCollectionName { get; set; } = string.Empty;
        public string NotificationsCollectionName { get; set; } = string.Empty;
        public string ActivityLogsCollectionName { get; set; } = string.Empty;
    }
}
