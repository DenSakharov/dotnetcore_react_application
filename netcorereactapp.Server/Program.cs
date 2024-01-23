using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using netcorereactapp.Server.Controllers.Authentication;
using netcorereactapp.Server.Services.AuthenctionServices;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using netcorereactapp.Server.Infrostructure.Exctentions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.AddInfrostructre()
    .AddHttp()
    .AddCors()
    .AddAuthnticationAndAuthorization(builder.Configuration);

var app = builder.Build();


app.UseCors("CorsPolicy");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>endpoints.MapControllers());

app.Run();
