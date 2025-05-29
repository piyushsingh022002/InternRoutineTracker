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
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Register([FromBody] RegisterDTO registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(result, "User registered successfully"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<AuthResponseDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<AuthResponseDTO>.ErrorResponse("An error occurred while registering the user", ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(result, "Login successful"));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<AuthResponseDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<AuthResponseDTO>.ErrorResponse("An error occurred while logging in", ex.Message));
            }
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserDTO>>> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(ApiResponse<UserDTO>.ErrorResponse("User is not authenticated"));
                }

                var user = await _authService.GetCurrentUserAsync(userId);
                return Ok(ApiResponse<UserDTO>.SuccessResponse(user));
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ApiResponse<UserDTO>.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserDTO>.ErrorResponse("An error occurred while getting user information", ex.Message));
            }
        }
    }
}
