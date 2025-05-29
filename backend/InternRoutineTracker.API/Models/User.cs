using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InternRoutineTracker.API.Models
{
    [Table("Users")]
    public class User
    {
        public User()
        {
            Notes = new List<Note>();
            Notifications = new List<Notification>();
            ActivityLogs = new List<ActivityLog>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<Note> Notes { get; set; }

        [JsonIgnore]
        public virtual ICollection<Notification> Notifications { get; set; }

        [JsonIgnore]
        public virtual ICollection<ActivityLog> ActivityLogs { get; set; }
    }
}
