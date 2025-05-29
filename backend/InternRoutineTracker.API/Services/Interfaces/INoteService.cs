using InternRoutineTracker.API.Models.DTOs;

namespace InternRoutineTracker.API.Services.Interfaces
{
    public interface INoteService
    {
        Task<List<NoteDTO>> GetAllNotesAsync();
        Task<List<NoteDTO>> GetUserNotesAsync(string userId);
        Task<NoteDTO> GetNoteByIdAsync(string id, string userId);
        Task<NoteDTO> CreateNoteAsync(CreateNoteDTO createNoteDto, string userId);
        Task<NoteDTO> UpdateNoteAsync(string id, UpdateNoteDTO updateNoteDto, string userId);
        Task DeleteNoteAsync(string id, string userId);
        Task<List<NoteDTO>> GetUserNotesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
    }
}
