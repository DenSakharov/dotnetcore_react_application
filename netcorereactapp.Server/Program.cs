using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using netcorereactapp.Server.Services.Interfaces;
using netcorereactapp.Server.Services;
using System.Text;
using netcorereactapp.Server.Controllers.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .WithOrigins("https://localhost:5173")  // ����������� �������� (origins)
            .AllowAnyMethod()                      // ����������� HTTP-������
            .AllowAnyHeader()                      // ����������� HTTP-���������
            .AllowCredentials());                  // ���������� ���������� ������� ������
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            // ��������� ���������� � ������������ �� ������
            var user = context.Principal;

            // ��������� ������ ��������������� ������
            var validatedToken = context.SecurityToken;
            Console.WriteLine("" + DateTime.Now);

            Console.WriteLine($"Token validated for user: {user.Identity?.Name}");
            Console.WriteLine($"Token issuer: {validatedToken.Issuer}");
            Console.WriteLine( $"Token audience:\n" +
                $"{validatedToken.SecurityKey.KeyId};\n" +
                $"{validatedToken.SecurityKey.KeySize};\n"+
                 $"{validatedToken.SecurityKey.CryptoProviderFactory};\n" );

            Console.WriteLine($"Token valid from: {validatedToken.ValidFrom}");
            Console.WriteLine($"Token valid to: {validatedToken.ValidTo}");
            Console.WriteLine($"Token claims: {string.Join(", ", user.Claims.Select(c => $"{c.Type}={c.Value}"))}");

            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine(""+DateTime.Now);
            Console.WriteLine($"Received token from path : {context.Request.Path}");
            Console.WriteLine($"Received token from pat Body : {context.Request.Body}");
            Console.WriteLine($"Received token from pat Headers.Authorization : {context.Request.Headers.Authorization}");
            Console.WriteLine($"Received token from pat Headers : {context.Request.Headers}");
            Console.WriteLine($"Token: {context.Token}");

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("" + DateTime.Now);
            Console.WriteLine($"Authentication failed for path: {context.HttpContext.Request.Path}");
            Console.WriteLine($"Request.Headers.Cookie : {context.Request.Headers.Cookie}");
            Console.WriteLine($"Request.Headers.Authorization : {context.Request.Headers.Authorization}");
            Console.WriteLine($"Exception: {context.Exception}");

            return Task.CompletedTask;
        },
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // ���������, ����� �� �������������� �������� ��� ��������� ������
        ValidateIssuer = true,
        // ������, �������������� ��������
        ValidIssuer = AuthOptions.ISSUER,
        // ����� �� �������������� ����������� ������
        ValidateAudience = true,
        // ��������� ����������� ������
        ValidAudience = AuthOptions.AUDIENCE,
        // ����� �� �������������� ����� �������������
        ValidateLifetime = true,
        // ��������� ����� ������������
        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(builder.Configuration["Configuration:SecretKey"]),
        // ��������� ����� ������������
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>endpoints.MapControllers());

app.Run();
