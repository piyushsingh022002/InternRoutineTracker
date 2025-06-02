using System.ComponentModel.DataAnnotations;

namespace InternRoutineTracker.API.Models.DTOs
{
    public class CreateNoteDTO
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public List<string> Tags { get; set; } = new List<string>();

        public List<string> MediaUrls { get; set; } = new List<string>();
    }

    public class UpdateNoteDTO
    {
        [StringLength(100, MinimumLength = 1)]
        public string? Title { get; set; }

        public string? Content { get; set; }

        public List<string>? Tags { get; set; }

        public List<string>? MediaUrls { get; set; }
    }

    public class NoteDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public List<string> MediaUrls { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
