using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

public class CustomTokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IAuthService _tokenService;

    public CustomTokenValidationMiddleware(RequestDelegate next, IAuthService tokenService)
    {
        _next = next;
        _tokenService = tokenService;
    }

    public async Task Invoke(HttpContext context)
    {
        // Получаем имя пользователя из токена
        var identity = context.User.Identity as ClaimsIdentity;
        var login = identity?.FindFirst(ClaimTypes.Name)?.Value;

        // Получаем роль пользователя из токена
        var role = identity?.FindFirst(ClaimTypes.Role)?.Value;

        // Генерируем новый токен, используя параметры из токена
        var newToken = await _tokenService.Get_Token(login, role);

        // Добавляем новый токен в ответ
        context.Response.Headers["New-Token"] = newToken;

        await _next(context);
    }
}
