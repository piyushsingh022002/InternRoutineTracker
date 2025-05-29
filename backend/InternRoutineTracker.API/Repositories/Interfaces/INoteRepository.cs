using InternRoutineTracker.API.Models;

namespace InternRoutineTracker.API.Repositories.Interfaces
{
    public interface INoteRepository
    {
        Task<List<Note>> GetAllAsync();
        Task<List<Note>> GetByUserIdAsync(int userId);
        Task<Note?> GetByIdAsync(int id);
        Task<Note> CreateAsync(Note note);
        Task UpdateAsync(int id, Note note);
        Task RemoveAsync(int id);
        Task<bool> UserOwnsNoteAsync(int userId, int noteId);
        Task<List<Note>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    }
}
