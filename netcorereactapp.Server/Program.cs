using netcorereactapp.Server.Infrostructure.Exctentions;
using netcorereactapp.Server.Services.PostgreService;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Infrostructure.Middlewares;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.AddInfrostructre()
    .AddHttp()
    .AddCors()
    .AddAuthnticationAndAuthorization(builder.Configuration)
    .AddServicesForControllers();

//builder.Services.AddScoped<PostgreService>();
string connection = builder.Configuration["Configuration:db"];
builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseNpgsql(connection)
    .UseLoggerFactory(null),
    ServiceLifetime.Scoped
    );

builder.Services.Configure<IISServerOptions>(options =>
{
    options.AllowSynchronousIO = true;
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // максимальный размер тела запроса в байтах ( 50 МБ)
});

var app = builder.Build();


app.UseCors("CorsPolicy");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//app.UseMiddleware<CustomTokenValidationMiddleware>();
//app.UseMiddleware<RequestLoggingMiddleware>();
app.UseEndpoints(
    endpoints =>
    {
        endpoints.MapControllers().RequireAuthorization();
    }
);

app.Run();
