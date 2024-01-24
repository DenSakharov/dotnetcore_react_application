using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using netcorereactapp.Server.Models;
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
        private readonly IPostgreService postgreService;
        public AuthenticationController(IAuthService _authService, IPostgreService _postgreService)
        {
            authService = _authService;
            postgreService = _postgreService;
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Пример простой проверки пользователя (замените на вашу логику)
            var user = IsValidUser(model.Login, model.Password);
            if (user != null)
            {
                string token = authService.Get_Token(user.Login, user.Role);
                return Ok(new { Token = token });
            }
            return Unauthorized();
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] LoginModel model)
        {
            var user =postgreService.CreateUser(model);
            string token = authService.Get_Token(user.Login, user.Role);
            return Ok(new { Token = token });

            return Unauthorized();
        }

        private LoginModel IsValidUser(string username, string password)
        {
            return postgreService.IsExistingUserInDB(username);
        }
    }
}
