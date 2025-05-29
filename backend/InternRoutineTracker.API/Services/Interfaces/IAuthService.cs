using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;

namespace InternRoutineTracker.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto);
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
        Task<UserDTO> GetCurrentUserAsync(string userId);
    }
}
