using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace netcorereactapp.Server.Controllers.Authentication
{
    [ApiController]
    [Route("authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthenticationController(IAuthService _authService)
        {
            authService = _authService;
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Пример простой проверки пользователя (замените на вашу логику)
            if (IsValidUser(model.Login, model.Password))
            {
                string token = authService.Get_Token(model.Login, model.Role);
                return Ok(new { Token = token });
            }

            return Unauthorized();
        }

        private bool IsValidUser(string username, string password)
        {
            return username == "1" && password == "1";
        }
    }

    public class LoginModel
    {
        public string Login { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
    }

}
