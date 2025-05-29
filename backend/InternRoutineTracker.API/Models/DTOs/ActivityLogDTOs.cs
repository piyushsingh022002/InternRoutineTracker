namespace InternRoutineTracker.API.Models.DTOs
{
    public class ActivityLogDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public bool HasNote { get; set; }
        public int StreakCount { get; set; }
    }
}
