using InternRoutineTracker.API.Data;
using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternRoutineTracker.API.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly ApplicationDbContext _context;

        public NoteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Note>> GetAllAsync() =>
            await _context.Notes.ToListAsync();

        public async Task<List<Note>> GetByUserIdAsync(int userId) =>
            await _context.Notes
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

        public async Task<Note?> GetByIdAsync(int id) =>
            await _context.Notes.FindAsync(id);

        public async Task<Note> CreateAsync(Note note)
        {
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return note;
        }

        public async Task UpdateAsync(int id, Note updatedNote)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note != null)
            {
                // Update properties
                note.Title = updatedNote.Title;
                note.Content = updatedNote.Content;
                note.Tags = updatedNote.Tags;
                note.MediaUrls = updatedNote.MediaUrls;
                note.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveAsync(int id)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note != null)
            {
                _context.Notes.Remove(note);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UserOwnsNoteAsync(int userId, int noteId)
        {
            return await _context.Notes
                .AnyAsync(n => n.Id == noteId && n.UserId == userId);
        }

        public async Task<List<Note>> GetByUserIdAndDateRangeAsync(int userId, DateTime startDate, DateTime endDate) =>
            await _context.Notes
                .Where(n => n.UserId == userId && 
                       n.CreatedAt >= startDate && 
                       n.CreatedAt <= endDate)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
    }
}
