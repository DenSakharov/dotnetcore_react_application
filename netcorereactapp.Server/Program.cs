using netcorereactapp.Server.Infrostructure.Exctentions;
using netcorereactapp.Server.Services.PostgreService;
using Microsoft.EntityFrameworkCore;

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
var app = builder.Build();


app.UseCors("CorsPolicy");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>endpoints.MapControllers());

app.Run();
