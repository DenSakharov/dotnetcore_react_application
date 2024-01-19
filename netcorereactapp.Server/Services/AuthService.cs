using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using netcorereactapp.Server.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace netcorereactapp.Server.Services
{

    public class AuthService: IAuthService
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
        public string Get_Token(string login) 
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes( Get_Secret_Key() ); 

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.Name,login)
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Время жизни токена
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }
    }
}
