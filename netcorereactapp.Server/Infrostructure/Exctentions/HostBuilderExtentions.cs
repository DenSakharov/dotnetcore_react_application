using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using netcorereactapp.Server.Controllers.Authentication;
using netcorereactapp.Server.Controllers.ProccesController;
using netcorereactapp.Server.Infrostructure.Swagger;
using netcorereactapp.Server.Services.AuthenctionServices;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using netcorereactapp.Server.Services.ExcelImportService;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using System.Reflection;

namespace netcorereactapp.Server.Infrostructure.Exctentions
{
    public static class HostBuilderExtentions
    {
        public static IHostBuilder AddInfrostructre(this IHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                /// возможность работы с middleware
                services.AddSingleton<IStartupFilter, SwaggerStartupFilter>();

                services.AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                    ///сбор полного пространства имен
                    options.CustomSchemaIds(x => x.FullName);

                    ///добавляем путь к xml docs
                    var xmlFileName = Assembly.GetExecutingAssembly().GetName().Name + ".xml";
                    var xmlFilePath = Path.Combine(AppContext.BaseDirectory, xmlFileName);
                    options.IncludeXmlComments(xmlFilePath);
                    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                                },
                                Scheme = "oauth2",
                                Name = "Bearer",
                                In = ParameterLocation.Header,
                                },
                            new List<string>()
                        }
                    });
                });
            });
            return builder;
        }
        public static IHostBuilder AddHttp(this IHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.AddControllers(options =>
                {
                    options.Filters.Add(typeof(ValidateModelAttribute));
                    options.Filters.Add(typeof(LoggingActionFilter));
                });
            });
            return builder;
        }
        public static IHostBuilder AddCors(this IHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy",
                        builder => builder
                            .WithOrigins("https://localhost:5173")  // Разрешенный источник (origins)
                            .AllowAnyMethod()                      // Разрешенные HTTP-методы
                            .AllowAnyHeader()                      // Разрешенные HTTP-заголовки
                            .AllowCredentials());                  // Разрешение отправлять учетные данные
                });
            });
            return builder;
        }
        public static IHostBuilder AddAuthnticationAndAuthorization(this IHostBuilder builder,IConfiguration configuration)
        {
            builder.ConfigureServices(services =>
            {
                //services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(configuration["Configuration:db"]));
               

                services.AddAuthentication(options =>
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
                            // Получение информации о пользователе из токена
                            var user = context.Principal;

                            // Получение самого валидированного токена
                            var validatedToken = context.SecurityToken;

                            Console.WriteLine("" + DateTime.Now);

                            Console.WriteLine($"Token validated for user: {user.Identity?.Name}");
                            Console.WriteLine($"Token issuer: {validatedToken.Issuer}");

                            Console.WriteLine($"Token valid from: {validatedToken.ValidFrom}");
                            Console.WriteLine($"Token valid to: {validatedToken.ValidTo}");
                            Console.WriteLine($"Token claims: {string.Join(", ", user.Claims.Select(c => $"{c.Type}={c.Value}"))}");

                            return Task.CompletedTask;
                        },
                        OnMessageReceived = context =>
                        {
                            Console.WriteLine("" + DateTime.Now);
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
                        // указывает, будет ли валидироваться издатель при валидации токена
                        ValidateIssuer = true,
                        // строка, представляющая издателя
                        ValidIssuer = AuthOptions.ISSUER,
                        // будет ли валидироваться потребитель токена
                        ValidateAudience = true,
                        // установка потребителя токена
                        ValidAudience = AuthOptions.AUDIENCE,
                        // будет ли валидироваться время существования
                        ValidateLifetime = true,
                        // установка ключа безопасности
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(configuration["Configuration:SecretKey"]),
                        // валидация ключа безопасности
                        ValidateIssuerSigningKey = true,
                    };
                });

                services.AddAuthorization();
               
            });
            return builder;
        }

        public static IHostBuilder AddServicesForControllers(this IHostBuilder hostBuilder)
        {
            hostBuilder.ConfigureServices(services =>
            {
                services.AddScoped<IAuthService, AuthService>();
                services.AddScoped<IPostgreService, PostgreService>();
                services.AddScoped<IOrderService,OrderSevice>();
                services.AddScoped<IFileService, FileService>();
                services.AddScoped<IStatusService, StatusService>();
                services.AddScoped<IExcelImportService, ExcelImportService>();
                services.AddScoped<IProccesService, ProccesService>();
                services.AddScoped<IOperationService, OperationService>();
                 services.AddScoped<LoggingActionFilter>();
            });
            return hostBuilder;
        }
    }
}
