using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;
using InternRoutineTracker.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternRoutineTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly INoteService _noteService;

        public NotesController(INoteService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<NoteDTO>>>> GetUserNotes()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<List<NoteDTO>>.ErrorResponse("User is not authenticated"));
                }

                var notes = await _noteService.GetUserNotesAsync(userId);
                return Ok(ApiResponse<List<NoteDTO>>.SuccessResponse(notes));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<NoteDTO>>.ErrorResponse("An error occurred while retrieving notes", ex.Message));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<NoteDTO>>> GetNoteById(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<NoteDTO>.ErrorResponse("User is not authenticated"));
                }

                var note = await _noteService.GetNoteByIdAsync(id, userId);
                return Ok(ApiResponse<NoteDTO>.SuccessResponse(note));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<NoteDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<NoteDTO>.ErrorResponse("An error occurred while retrieving the note", ex.Message));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<NoteDTO>>> CreateNote([FromBody] CreateNoteDTO createNoteDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<NoteDTO>.ErrorResponse("User is not authenticated"));
                }

                var note = await _noteService.CreateNoteAsync(createNoteDto, userId);
                return CreatedAtAction(nameof(GetNoteById), new { id = note.Id }, ApiResponse<NoteDTO>.SuccessResponse(note, "Note created successfully"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<NoteDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<NoteDTO>.ErrorResponse("An error occurred while creating the note", ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<NoteDTO>>> UpdateNote(string id, [FromBody] UpdateNoteDTO updateNoteDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<NoteDTO>.ErrorResponse("User is not authenticated"));
                }

                var note = await _noteService.UpdateNoteAsync(id, updateNoteDto, userId);
                return Ok(ApiResponse<NoteDTO>.SuccessResponse(note, "Note updated successfully"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<NoteDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<NoteDTO>.ErrorResponse("An error occurred while updating the note", ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteNote(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("User is not authenticated"));
                }

                await _noteService.DeleteNoteAsync(id, userId);
                return Ok(ApiResponse<object>.SuccessResponse("Note deleted successfully"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while deleting the note", ex.Message));
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<ApiResponse<List<NoteDTO>>>> GetNotesByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<List<NoteDTO>>.ErrorResponse("User is not authenticated"));
                }

                var notes = await _noteService.GetUserNotesByDateRangeAsync(userId, startDate, endDate);
                return Ok(ApiResponse<List<NoteDTO>>.SuccessResponse(notes));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<NoteDTO>>.ErrorResponse("An error occurred while retrieving notes", ex.Message));
            }
        }
    }
}
