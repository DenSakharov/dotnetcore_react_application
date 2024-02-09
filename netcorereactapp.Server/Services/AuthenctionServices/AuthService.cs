using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using netcorereactapp.Server.Controllers.Authentication;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace netcorereactapp.Server.Services.AuthenctionServices
{

    public class AuthService : IAuthService
    {
        private readonly IConfiguration configuration;
        public AuthService(IConfiguration _configuration)
        {
            configuration = _configuration;
        }
        private string Get_Secret_Key()
        {
            string secretKey = configuration["Configuration:SecretKey"];
            return secretKey;
        }
        public async Task<string> Get_Token(string login , string role)
            {
            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, login),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
            signingCredentials:
            new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(Get_Secret_Key()),
            SecurityAlgorithms.HmacSha256)
            );


            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
            return tokenString;
        }
    }
}
