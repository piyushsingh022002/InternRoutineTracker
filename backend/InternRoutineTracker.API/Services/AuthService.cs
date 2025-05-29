using InternRoutineTracker.API.Helpers;
using InternRoutineTracker.API.Models;
using InternRoutineTracker.API.Models.DTOs;
using InternRoutineTracker.API.Repositories.Interfaces;
using InternRoutineTracker.API.Services.Interfaces;

namespace InternRoutineTracker.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto)
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                throw new ApplicationException("Email is already registered");
            }

            // Check if username already exists
            if (await _userRepository.UsernameExistsAsync(registerDto.Username))
            {
                throw new ApplicationException("Username is already taken");
            }

            // Create new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Save user to database
            await _userRepository.CreateAsync(user);

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user);

            // Return auth response
            return new AuthResponseDTO
            {
                User = MapToUserDto(user),
                Token = token
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new ApplicationException("Invalid email or password");
            }

            // Verify password
            if (!PasswordHelper.VerifyPassword(user.PasswordHash, loginDto.Password))
            {
                throw new ApplicationException("Invalid email or password");
            }

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user);

            // Return auth response
            return new AuthResponseDTO
            {
                User = MapToUserDto(user),
                Token = token
            };
        }

        public async Task<UserDTO> GetCurrentUserAsync(string userId)
        {
            int userIdInt = int.Parse(userId);
            var user = await _userRepository.GetByIdAsync(userIdInt);
            if (user == null)
            {
                throw new ApplicationException("User not found");
            }

            return MapToUserDto(user);
        }

        private static UserDTO MapToUserDto(User user)
        {
            return new UserDTO
            {
                Id = user.Id.ToString(),
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
