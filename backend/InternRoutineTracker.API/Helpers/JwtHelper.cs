using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InternRoutineTracker.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace InternRoutineTracker.API.Helpers
{
    public class JwtHelper
    {
        private readonly string _jwtSecret;
        private readonly string _jwtIssuer;
        private readonly string _jwtAudience;
        private readonly int _jwtExpiryInMinutes;

        public JwtHelper(IConfiguration configuration)
        {
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret configuration is missing");
            _jwtIssuer = configuration["Jwt:Issuer"] ?? "InternRoutineTrackerAPI";
            _jwtAudience = configuration["Jwt:Audience"] ?? "InternRoutineTrackerClient";
            _jwtExpiryInMinutes = int.Parse(configuration["Jwt:ExpiryInMinutes"] ?? "60");
        }

        public string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwtIssuer,
                audience: _jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtExpiryInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateToken(string token, out ClaimsPrincipal? claimsPrincipal)
        {
            claimsPrincipal = null;

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _jwtIssuer,
                    ValidAudience = _jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret))
                };

                claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
