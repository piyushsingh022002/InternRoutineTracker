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
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<NotificationDTO>>>> GetUserNotifications()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<List<NotificationDTO>>.ErrorResponse("User is not authenticated"));
                }

                var notifications = await _notificationService.GetUserNotificationsAsync(userId);
                return Ok(ApiResponse<List<NotificationDTO>>.SuccessResponse(notifications));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<NotificationDTO>>.ErrorResponse("An error occurred while retrieving notifications", ex.Message));
            }
        }

        [HttpGet("count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<int>.ErrorResponse("User is not authenticated"));
                }

                var count = await _notificationService.GetUnreadCountAsync(userId);
                return Ok(ApiResponse<int>.SuccessResponse(count));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<int>.ErrorResponse("An error occurred while retrieving notification count", ex.Message));
            }
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult<ApiResponse<object>>> MarkAsRead(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("User is not authenticated"));
                }

                await _notificationService.MarkAsReadAsync(id, userId);
                return Ok(ApiResponse<object>.SuccessResponse("Notification marked as read"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while marking notification as read", ex.Message));
            }
        }

        [HttpPut("read-all")]
        public async Task<ActionResult<ApiResponse<object>>> MarkAllAsRead()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<object>.ErrorResponse("User is not authenticated"));
                }

                await _notificationService.MarkAllAsReadAsync(userId);
                return Ok(ApiResponse<object>.SuccessResponse("All notifications marked as read"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while marking all notifications as read", ex.Message));
            }
        }
    }
}
