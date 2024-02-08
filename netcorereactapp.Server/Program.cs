using netcorereactapp.Server.Infrostructure.Exctentions;
using netcorereactapp.Server.Services.PostgreService;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Infrostructure.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.AddInfrostructre()
    .AddHttp()
    .AddCors()
    .AddAuthnticationAndAuthorization(builder.Configuration);

//builder.Services.AddScoped<PostgreService>();
string connection = builder.Configuration["Configuration:db"];
builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseNpgsql(connection));

builder.Services.Configure<IISServerOptions>(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();


app.UseCors("CorsPolicy");

app.UseRouting();

//app.UseMiddleware<CustomTokenValidationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

//app.UseMiddleware<RequestLoggingMiddleware>();

app.UseEndpoints(endpoints =>endpoints.MapControllers());

app.Run();
