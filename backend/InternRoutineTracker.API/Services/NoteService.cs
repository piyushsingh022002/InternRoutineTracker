using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;
using InternRoutineTracker.API.Repositories.Interfaces;
using InternRoutineTracker.API.Services.Interfaces;

namespace InternRoutineTracker.API.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _noteRepository;
        private readonly IActivityLogRepository _activityLogRepository;

        public NoteService(INoteRepository noteRepository, IActivityLogRepository activityLogRepository)
        {
            _noteRepository = noteRepository;
            _activityLogRepository = activityLogRepository;
        }

        public async Task<List<NoteDTO>> GetAllNotesAsync()
        {
            var notes = await _noteRepository.GetAllAsync();
            return notes.Select(MapToNoteDto).ToList();
        }

        public async Task<List<NoteDTO>> GetUserNotesAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            var notes = await _noteRepository.GetByUserIdAsync(userIdInt);
            return notes.Select(MapToNoteDto).ToList();
        }

        public async Task<NoteDTO> GetNoteByIdAsync(string id, string userId)
        {
            int idInt = int.Parse(id);
            int userIdInt = int.Parse(userId);
            var note = await _noteRepository.GetByIdAsync(idInt);
            
            if (note == null)
            {
                throw new ApplicationException("Note not found");
            }
            
            if (note.UserId != userIdInt)
            {
                throw new ApplicationException("You don't have permission to access this note");
            }
            
            return MapToNoteDto(note);
        }

        public async Task<NoteDTO> CreateNoteAsync(CreateNoteDTO createNoteDto, string userId)
        {
            int userIdInt = int.Parse(userId);
            var note = new Note
            {
                UserId = userIdInt,
                Title = createNoteDto.Title,
                Content = createNoteDto.Content,
                Tags = createNoteDto.Tags,
                MediaUrls = createNoteDto.MediaUrls,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            await _noteRepository.CreateAsync(note);
            
            // Update activity log for the day
            await UpdateActivityLog(userId);
            
            return MapToNoteDto(note);
        }

        public async Task<NoteDTO> UpdateNoteAsync(string id, UpdateNoteDTO updateNoteDto, string userId)
        {
            int idInt = int.Parse(id);
            int userIdInt = int.Parse(userId);
            var note = await _noteRepository.GetByIdAsync(idInt);
            
            if (note == null)
            {
                throw new ApplicationException("Note not found");
            }
            
            if (note.UserId != userIdInt)
            {
                throw new ApplicationException("You don't have permission to update this note");
            }
            
            // Update note properties
            if (updateNoteDto.Title != null)
            {
                note.Title = updateNoteDto.Title;
            }
            
            if (updateNoteDto.Content != null)
            {
                note.Content = updateNoteDto.Content;
            }
            
            if (updateNoteDto.Tags != null)
            {
                note.Tags = updateNoteDto.Tags;
            }
            
            if (updateNoteDto.MediaUrls != null)
            {
                note.MediaUrls = updateNoteDto.MediaUrls;
            }
            
            note.UpdatedAt = DateTime.UtcNow;
            
            await _noteRepository.UpdateAsync(idInt, note);
            
            return MapToNoteDto(note);
        }

        public async Task DeleteNoteAsync(string id, string userId)
        {
            int idInt = int.Parse(id);
            int userIdInt = int.Parse(userId);
            var note = await _noteRepository.GetByIdAsync(idInt);
            
            if (note == null)
            {
                throw new ApplicationException("Note not found");
            }
            
            if (note.UserId != userIdInt)
            {
                throw new ApplicationException("You don't have permission to delete this note");
            }
            
            await _noteRepository.RemoveAsync(idInt);
            
            // Check if this was the only note for the day and update activity log if needed
            var today = DateTime.UtcNow.Date;
            var startOfDay = today;
            var endOfDay = today.AddDays(1).AddTicks(-1);
            
            var notesForToday = await _noteRepository.GetByUserIdAndDateRangeAsync(userIdInt, startOfDay, endOfDay);
            
            if (notesForToday.Count == 0)
            {
                var activityLog = await _activityLogRepository.GetByUserIdAndDateAsync(userIdInt, today);
                if (activityLog != null)
                {
                    activityLog.HasNote = false;
                    await _activityLogRepository.UpdateAsync(activityLog.Id, activityLog);
                }
            }
        }

        public async Task<List<NoteDTO>> GetUserNotesByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
        {
            int userIdInt = int.Parse(userId);
            var notes = await _noteRepository.GetByUserIdAndDateRangeAsync(userIdInt, startDate, endDate);
            return notes.Select(MapToNoteDto).ToList();
        }

        private async Task UpdateActivityLog(string userId)
        {
            int userIdInt = int.Parse(userId);
            var today = DateTime.UtcNow.Date;
            var activityLog = await _activityLogRepository.GetByUserIdAndDateAsync(userIdInt, today);
            
            if (activityLog == null)
            {
                // Create new activity log for today
                var streak = await _activityLogRepository.GetCurrentStreakAsync(userIdInt);
                
                activityLog = new ActivityLog
                {
                    UserId = userIdInt,
                    Date = today,
                    HasNote = true,
                    StreakCount = streak + 1
                };
                
                await _activityLogRepository.CreateAsync(activityLog);
            }
            else if (!activityLog.HasNote)
            {
                // Update existing activity log
                activityLog.HasNote = true;
                await _activityLogRepository.UpdateAsync(activityLog.Id, activityLog);
            }
        }

        private static NoteDTO MapToNoteDto(Note note)
        {
            return new NoteDTO
            {
                Id = note.Id.ToString(),
                UserId = note.UserId.ToString(),
                Title = note.Title,
                Content = note.Content,
                Tags = note.Tags,
                MediaUrls = note.MediaUrls,
                CreatedAt = note.CreatedAt,
                UpdatedAt = note.UpdatedAt
            };
        }
    }
}
