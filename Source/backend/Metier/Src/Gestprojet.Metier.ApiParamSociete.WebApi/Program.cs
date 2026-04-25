using System.Text;
using Gestprojet.Core.ApiParamSociete.Client;
using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Metier.ApiParamSociete.Application.Societe;
using Microsoft.IdentityModel.Tokens;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe;
using Gestprojet.Metier.ApiParamSociete.Infrastructure.Services;
using Gestprojet.Metier.ApiParamSociete.WebApi.Hubs;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;

namespace Gestprojet.Metier.ApiParamSociete.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // === CORS ===
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllWithCredentials", policyBuilder =>
                {
                    policyBuilder.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200", "http://127.0.0.1:55307", "http://localhost:55307")
                                 .AllowAnyMethod()
                                 .AllowAnyHeader()
                                 .AllowCredentials();
                });
                options.AddPolicy("AllowAll", policyBuilder =>
                {
                    policyBuilder.SetIsOriginAllowed(origin => true)
                                 .AllowAnyMethod()
                                 .AllowAnyHeader()
                                 .AllowCredentials();
                });
            });

            // === Authentication (JWT) ===
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var jwtKey = jwtSettings["Key"] ?? "DefaultSecretKey12345678901234567890";
            var jwtIssuer = jwtSettings["Issuer"] ?? "Gestprojet.Metier.ApiParamSociete.WebApi";
            var jwtAudience = jwtSettings["Audience"] ?? "Gestprojet.Metier.ApiParamSociete.Client";

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,
                    ValidateAudience = true,
                    ValidAudience = jwtAudience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Allow preflight requests to pass through authentication
                        if (context.Request.Method == "OPTIONS")
                        {
                            context.NoResult();
                            return Task.CompletedTask;
                        }
                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        // Skip challenge for OPTIONS requests
                        if (context.Request.Method == "OPTIONS")
                        {
                            context.HandleResponse();
                            return Task.CompletedTask;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            // === Controllers ===
            builder.Services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                });

            // === SignalR ===
            builder.Services.AddSignalR();

            // === Swagger ===
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // === Configuration des URLs ===
            string apiParamSocieteBaseAdresse = builder.Configuration.GetSection("URL").GetValue<string>("ApiParamSociete")
                ?? throw new InvalidOperationException("URL:ApiParamSociete configuration is missing");

            // === Configuration des HttpClients ===
            static void ConfigureHttpClient(HttpClient client, string baseUrl)
            {
                if (!string.IsNullOrWhiteSpace(baseUrl))
                    client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            }

            // === Enregistrement des HttpClients nommés ===
            builder.Services.AddHttpClient("ApiParamSociete", client =>
            {
                ConfigureHttpClient(client, apiParamSocieteBaseAdresse);
            });

            // === Enregistrement des REST Clients ===
            builder.Services.AddScoped<IApplicationApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new ApplicationApi(config);
            });
            builder.Services.AddScoped<IAttachementApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new AttachementApi(config);
            });
            builder.Services.AddScoped<IModuleApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new ModuleApi(config);
            });
            builder.Services.AddScoped<IPermissionApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new PermissionApi(config);
            });
            builder.Services.AddScoped<IPointageApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new PointageApi(config);
            });
            builder.Services.AddScoped<IProjetApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new ProjetApi(config);
            });
            builder.Services.AddScoped<IProjetUtilisateurApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new ProjetUtilisateurApi(config);
            });
            builder.Services.AddScoped<IRoleApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new RoleApi(config);
            });
            builder.Services.AddScoped<ISocieteApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new SocieteApi(config);
            });
            builder.Services.AddScoped<ISousTacheApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new SousTacheApi(config);
            });
            builder.Services.AddScoped<ITacheApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new TacheApi(config);
            });
            builder.Services.AddScoped<ITacheAssignationApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new TacheAssignationApi(config);
            });
            builder.Services.AddScoped<ITypeApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new TypeApi(config);
            });
            builder.Services.AddScoped<ITypeUtilisateurApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new TypeUtilisateurApi(config);
            });
            builder.Services.AddScoped<IUtilisateurApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new UtilisateurApi(config);
            });
            builder.Services.AddScoped<IDemandeCongeApi>(provider =>
            {
                var config = new Gestprojet.Core.ApiParamSociete.Client.Client.Configuration { BasePath = apiParamSocieteBaseAdresse };
                config.DefaultHeaders = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                };
                return new DemandeCongeApi(config);
            });


            // === Enregistrement des Services ===
            builder.Services.AddScoped<ICodeGenerationService, CodeGenerationService>();
            builder.Services.AddHttpClient<OllamaService>();
            builder.Services.AddScoped<INotificationService, NotificationService>();
            builder.Services.AddScoped<EvaluationService>();
            builder.Services.AddScoped<CalculationService>();
            builder.Services.AddScoped<RHCalculationService>();

            // === Enregistrement des Repositories et Business ===
            builder.Services.AddScoped<ISocieteRepository, SocieteRepository>();
            builder.Services.AddScoped<ISocieteBusiness, SocieteBusiness>();
            builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
            builder.Services.AddScoped<IApplicationBusiness, ApplicationBusiness>();
            builder.Services.AddScoped<IAttachementRepository, AttachementRepository>();
            builder.Services.AddScoped<IAttachementBusiness, AttachementBusiness>();
            builder.Services.AddScoped<IDemandeCongeRepository, DemandeCongeRepository>();
            builder.Services.AddScoped<IDemandeCongeBusiness, DemandeCongeBusiness>();
            builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
            builder.Services.AddScoped<IModuleBusiness, ModuleBusiness>();
            builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
            builder.Services.AddScoped<IPermissionBusiness, PermissionBusiness>();
            builder.Services.AddScoped<IPointageRepository, PointageRepository>();
            builder.Services.AddScoped<IPointageBusiness, PointageBusiness>();
            builder.Services.AddScoped<IProjetRepository, ProjetRepository>();
            builder.Services.AddScoped<IProjetBusiness, ProjetBusiness>();
            builder.Services.AddScoped<IProjetUtilisateurRepository, ProjetUtilisateurRepository>();
            builder.Services.AddScoped<IProjetUtilisateurBusiness, ProjetUtilisateurBusiness>();
            builder.Services.AddScoped<IRoleRepository, RoleRepository>();
            builder.Services.AddScoped<IRoleBusiness, RoleBusiness>();
            builder.Services.AddScoped<ISousTacheRepository, SousTacheRepository>();
            builder.Services.AddScoped<ISousTacheBusiness, SousTacheBusiness>();
            builder.Services.AddScoped<ITacheRepository, TacheRepository>();
            builder.Services.AddScoped<ITacheBusiness, TacheBusiness>();
            builder.Services.AddScoped<ITacheAssignationRepository, TacheAssignationRepository>();
            builder.Services.AddScoped<ITacheAssignationBusiness, TacheAssignationBusiness>();
            builder.Services.AddScoped<ITypeRepository, TypeRepository>();
            builder.Services.AddScoped<ITypeBusiness, TypeBusiness>();
            builder.Services.AddScoped<ITypeUtilisateurRepository, TypeUtilisateurRepository>();
            builder.Services.AddScoped<ITypeUtilisateurBusiness, TypeUtilisateurBusiness>();
            builder.Services.AddScoped<IUtilisateurRepository, UtilisateurRepository>();
            builder.Services.AddScoped<IUtilisateurBusiness, UtilisateurBusiness>();


            var app = builder.Build();

            // === Pipeline HTTP ===
            app.UseStaticFiles();
            app.UseCors("AllowAll");
            app.UseMiddleware<Gestprojet.Metier.ApiParamSociete.WebApi.Middleware.ExceptionMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapHub<NotificationHub>("/hubs/notifications");
            app.Run();
        }
    }
}
