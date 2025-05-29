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
    public class ActivityLogsController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;

        public ActivityLogsController(IActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ActivityLogDTO>>>> GetUserActivityLogs()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<List<ActivityLogDTO>>.ErrorResponse("User is not authenticated"));
                }

                var activityLogs = await _activityLogService.GetUserActivityLogsAsync(userId);
                return Ok(ApiResponse<List<ActivityLogDTO>>.SuccessResponse(activityLogs));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<ActivityLogDTO>>.ErrorResponse("An error occurred while retrieving activity logs", ex.Message));
            }
        }

        [HttpGet("date")]
        public async Task<ActionResult<ApiResponse<ActivityLogDTO>>> GetActivityForDate([FromQuery] DateTime date)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<ActivityLogDTO>.ErrorResponse("User is not authenticated"));
                }

                var activityLog = await _activityLogService.GetUserActivityForDateAsync(userId, date);
                if (activityLog == null)
                {
                    return NotFound(ApiResponse<ActivityLogDTO>.ErrorResponse("No activity log found for the specified date"));
                }

                return Ok(ApiResponse<ActivityLogDTO>.SuccessResponse(activityLog));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<ActivityLogDTO>.ErrorResponse("An error occurred while retrieving activity log", ex.Message));
            }
        }

        [HttpGet("streak")]
        public async Task<ActionResult<ApiResponse<int>>> GetCurrentStreak()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<int>.ErrorResponse("User is not authenticated"));
                }

                var streak = await _activityLogService.GetCurrentStreakAsync(userId);
                return Ok(ApiResponse<int>.SuccessResponse(streak));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<int>.ErrorResponse("An error occurred while retrieving streak information", ex.Message));
            }
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<ApiResponse<List<ActivityLogDTO>>>> GetActivityForDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<List<ActivityLogDTO>>.ErrorResponse("User is not authenticated"));
                }

                var activityLogs = await _activityLogService.GetUserActivityForDateRangeAsync(userId, startDate, endDate);
                return Ok(ApiResponse<List<ActivityLogDTO>>.SuccessResponse(activityLogs));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<ActivityLogDTO>>.ErrorResponse("An error occurred while retrieving activity logs", ex.Message));
            }
        }
    }
}
