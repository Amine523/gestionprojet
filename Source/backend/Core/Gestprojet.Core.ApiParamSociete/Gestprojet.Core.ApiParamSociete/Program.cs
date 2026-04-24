using Gestprojet.Core.ApiParamSociete.Application;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Linq;
using System.IO;
using Microsoft.Extensions.DependencyInjection;

Console.WriteLine("#############################################");
Console.WriteLine("###   DEBUG: API CORE INITIALIZATION      ###");
Console.WriteLine("#############################################");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
    });

// SignalR
builder.Services.AddSignalR();

// Database Context
builder.Services.AddSingleton<Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper.DapperContext>();

// Repositories - Only existing in Core project
builder.Services.AddScoped<IUtilisateurCoreRepository, UtilisateurCoreRepository>();
builder.Services.AddScoped<IProjetCoreRepository, ProjetCoreRepository>();
builder.Services.AddScoped<ITacheCoreRepository, TacheCoreRepository>();
builder.Services.AddScoped<ITypeUtilisateurCoreRepository, TypeUtilisateurCoreRepository>();
builder.Services.AddScoped<ISocieteCoreRepository, SocieteCoreRepository>();
builder.Services.AddScoped<IApplicationCoreRepository, ApplicationCoreRepository>();
builder.Services.AddScoped<IAttachementCoreRepository, AttachementCoreRepository>();
builder.Services.AddScoped<IModuleCoreRepository, ModuleCoreRepository>();
builder.Services.AddScoped<IPermissionCoreRepository, PermissionCoreRepository>();
builder.Services.AddScoped<IPointageCoreRepository, PointageCoreRepository>();
builder.Services.AddScoped<IProjetUtilisateurCoreRepository, ProjetUtilisateurCoreRepository>();
builder.Services.AddScoped<IRoleCoreRepository, RoleCoreRepository>();
builder.Services.AddScoped<ISousTacheCoreRepository, SousTacheCoreRepository>();
builder.Services.AddScoped<ITacheAssignationCoreRepository, TacheAssignationCoreRepository>();
builder.Services.AddScoped<ITypeCoreRepository, TypeCoreRepository>();
builder.Services.AddScoped<IAbonnementCoreRepository, AbonnementCoreRepository>();
builder.Services.AddScoped<IDemandeCongeCoreRepository, DemandeCongeCoreRepository>();
builder.Services.AddScoped<IJourFerieCoreRepository, JourFerieCoreRepository>();
builder.Services.AddScoped<ITestCoreRepository, TestCoreRepository>();

// Business - Only existing in Core project
builder.Services.AddScoped<IUtilisateurCoreBusiness, UtilisateurCoreBusiness>();
builder.Services.AddScoped<IProjetCoreBusiness, ProjetCoreBusiness>();
builder.Services.AddScoped<ITacheCoreBusiness, TacheCoreBusiness>();
builder.Services.AddScoped<ITypeUtilisateurCoreBusiness, TypeUtilisateurCoreBusiness>();
builder.Services.AddScoped<ISocieteCoreBusiness, SocieteCoreBusiness>();
builder.Services.AddScoped<IApplicationCoreBusiness, ApplicationCoreBusiness>();
builder.Services.AddScoped<IAttachementCoreBusiness, AttachementCoreBusiness>();
builder.Services.AddScoped<IModuleCoreBusiness, ModuleCoreBusiness>();
builder.Services.AddScoped<IPermissionCoreBusiness, PermissionCoreBusiness>();
builder.Services.AddScoped<IPointageCoreBusiness, PointageCoreBusiness>();
builder.Services.AddScoped<IProjetUtilisateurCoreBusiness, ProjetUtilisateurCoreBusiness>();
builder.Services.AddScoped<IRoleCoreBusiness, RoleCoreBusiness>();
builder.Services.AddScoped<ISousTacheCoreBusiness, SousTacheCoreBusiness>();
builder.Services.AddScoped<ITacheAssignationCoreBusiness, TacheAssignationCoreBusiness>();
builder.Services.AddScoped<ITypeCoreBusiness, TypeCoreBusiness>();
builder.Services.AddScoped<IAbonnementCoreBusiness, AbonnementCoreBusiness>();
builder.Services.AddScoped<IDemandeCongeCoreBusiness, DemandeCongeCoreBusiness>();
builder.Services.AddScoped<IJourFerieCoreBusiness, JourFerieCoreBusiness>();
builder.Services.AddScoped<ITestCoreBusiness, TestCoreBusiness>();

// AI Services
builder.Services.AddScoped<IOllamaService, OllamaService>();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = jwtSettings["Key"] ?? "DefaultSecretKey12345678901234567890";

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .SetIsOriginAllowed(origin => true) // Allow all origins explicitly
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Execute Data Seeding
try
{
    using (var scope = app.Services.CreateScope())
    {
        var typeRepo = scope.ServiceProvider.GetRequiredService<ITypeUtilisateurCoreRepository>();
        var userRepo = scope.ServiceProvider.GetRequiredService<IUtilisateurCoreRepository>();
        
        // Log file path
        string logPath = Path.Combine(app.Environment.ContentRootPath, "seeding_log.txt");
        void Log(string message) 
        {
            Console.WriteLine($">>> {message}");
            try { File.AppendAllText(logPath, $"{DateTime.Now}: {message}{Environment.NewLine}"); } catch { }
        }

        Log("Database Seeding: Starting...");

        try
        {
            // 1. Seed Type Utilisateur
            Log("Fetching Type Utilisateur list...");
            var types = await typeRepo.ListeTypeUtilisateurCoreAsync() ?? new List<Gestprojet.Core.ApiParamSociete.Domain.Models.TypeUtilisateurCore>();
            Log($"Found {types.Count} types.");
            
            var typeId = types.FirstOrDefault(t => t.Nom == "Administrateur")?.Id;

            var typeIds = new Dictionary<string, string>
            {
                { "Administrateur", "T001" },
                { "Admin Société", "T002" },
                { "RH", "T003" },
                { "Chef Projet", "T004" },
                { "Développeur", "T005" },
                { "Testeur", "T006" },
                { "Utilisateur", "T007" }
            };

            foreach (var kvp in typeIds)
            {
                var existingType = types.FirstOrDefault(t => t.Nom == kvp.Key);
                if (existingType == null)
                {
                    Log($"Type '{kvp.Key}' not found. Attempting to create...");
                    try {
                        var success = await typeRepo.AjouterTypeUtilisateurCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.TypeUtilisateurCore
                        {
                            Id = kvp.Value,
                            Nom = kvp.Key,
                            Description = $"Type utilisateur {kvp.Key}",
                            Actif = true
                        });
                        Log(success ? $"SUCCESS: Type '{kvp.Key}' created." : $"FAILURE: Could not create Type {kvp.Key}.");
                    } catch (Exception ex) { Log($"Skipping Type {kvp.Key}: {ex.Message}"); }
                }
                else
                {
                    Log($"INFO: Type '{kvp.Key}' exists (Id: {existingType.Id}).");
                }
            }

            typeId = types.FirstOrDefault(t => t.Nom == "Administrateur")?.Id ?? "T001";

            // 2. Seed Utilisateur (Super Admin)
            Log("Fetching User list...");
            var users = await userRepo.ListeUtilisateurCoreAsync() ?? new List<Gestprojet.Core.ApiParamSociete.Domain.Models.UtilisateurCore>();
            Log($"Found {users.Count} users.");

            if (!users.Any(u => u.Email == "admin@gestprojet.com"))
            {
                Log("User 'admin@gestprojet.com' not found. Attempting to create...");
                try {
                    var success = await userRepo.AjouterUtilisateurCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.UtilisateurCore
                    {
                        Id = "USR001",
                        Nom = "super Admin",
                        Email = "admin@gestprojet.com",
                        MotDePasse = Gestprojet.Core.ApiParamSociete.Infrastructure.Commun.SecurityUtils.HashPassword("Admin123!"),
                        CV = "",
                        TypeUtilisateurId = typeId ?? "T001",
                        SocieteId = "",
                        RoleId = "",
                        Actif = true
                    });
                    Log(success ? "SUCCESS: User 'super Admin' created." : "FAILURE: Could not create User 'super Admin' (Check SQL stored procedures).");
                } catch (Exception ex) { Log($"Skipping admin user: {ex.Message}"); }
            }
            else
            {
                Log("INFO: User 'admin@gestprojet.com' already exists.");
            }

            // 3. Seed Utilisateurs U1-U6
            var usersToSeed = new[]
            {
                new { Id = "U1", Nom = "AdminGlobal", Email = "admin@softpro.com", TypeId = "T001" },
                new { Id = "U2", Nom = "AdminSociete", Email = "adminS@softpro.com", TypeId = "T002" },
                new { Id = "U3", Nom = "ChefProjet", Email = "chef@softpro.com", TypeId = "T004" },
                new { Id = "U4", Nom = "Dev1", Email = "dev1@softpro.com", TypeId = "T005" },
                new { Id = "U5", Nom = "RH1", Email = "rh@softpro.com", TypeId = "T003" },
                new { Id = "U6", Nom = "Tester1", Email = "qa@softpro.com", TypeId = "T006" }
            };

            foreach (var u in usersToSeed)
            {
                if (!users.Any(user => user.Email == u.Email))
                {
                    Log($"User '{u.Email}' not found. Creating...");
                    try {
                        var pwdHash = Gestprojet.Core.ApiParamSociete.Infrastructure.Commun.SecurityUtils.HashPassword("SoftPro");
                        var created = await userRepo.AjouterUtilisateurCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.UtilisateurCore
                        {
                            Id = u.Id,
                            Nom = u.Nom,
                            Email = u.Email,
                            MotDePasse = pwdHash,
                            CV = "",
                            TypeUtilisateurId = u.TypeId,
                            SocieteId = "SP001",
                            RoleId = "",
                            Actif = true
                        });
                        Log(created ? $"SUCCESS: User '{u.Nom}' created." : $"FAILURE: Could not create User '{u.Nom}'.");
                    } catch(Exception ex) { Log($"Skipping User {u.Nom}: {ex.Message}"); }
                }
                else
                {
                    Log($"INFO: User '{u.Email}' already exists.");
                }
            }
            // 4. Seed Sociétés
            var societeRepo = scope.ServiceProvider.GetRequiredService<ISocieteCoreRepository>();
            var societes = await societeRepo.ListeSocieteCoreAsync() ?? new List<Gestprojet.Core.ApiParamSociete.Domain.Models.SocieteCore>();
            if (!societes.Any(s => s.Id == "SP001"))
            {
                Log("Société 'SP001' not found. Creating...");
                try {
                    await societeRepo.AjouterSocieteCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.SocieteCore
                    {
                        Id = "SP001",
                        Nom = "SoftPro",
                        Adresse = "Tunis, Tunisie",
                        TelephoneContact = "+216 71 000 000",
                        Email = "contact@softpro.com",
                        Actif = true
                    });
                } catch(Exception ex) { Log($"Skipping Societe SP001: {ex.Message}"); }
            }

            // 5. Seed Projets
            var projetRepo = scope.ServiceProvider.GetRequiredService<IProjetCoreRepository>();
            var projets = await projetRepo.ListeProjetCoreAsync() ?? new List<Gestprojet.Core.ApiParamSociete.Domain.Models.ProjetCore>();
            if (!projets.Any())
            {
                Log("No projects found. Seeding demo projects...");
                await projetRepo.AjouterProjetCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.ProjetCore
                {
                    Id = "PRJ001",
                    Nom = "Migration Cloud",
                    Description = "Migration de l'infrastructure vers AWS",
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddMonths(3),
                    Status = "En cours",
                    Priorite = "Haute",
                    UtilisateurId = "U3",
                    Actif = true
                });
                await projetRepo.AjouterProjetCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.ProjetCore
                {
                    Id = "PRJ002",
                    Nom = "Refonte UI/UX",
                    Description = "Nouveau design pour le portail client",
                    StartDate = DateTime.Now.AddDays(-10),
                    EndDate = DateTime.Now.AddMonths(1),
                    Status = "En attente",
                    Priorite = "Moyenne",
                    UtilisateurId = "U3",
                    Actif = true
                });
            }

            // 6. Seed Tâches
            var tacheRepo = scope.ServiceProvider.GetRequiredService<ITacheCoreRepository>();
            var taches = await tacheRepo.ListeTacheCoreAsync() ?? new List<Gestprojet.Core.ApiParamSociete.Domain.Models.TacheCore>();
            if (!taches.Any())
            {
                Log("No tasks found. Seeding demo tasks...");
                try {
                    await tacheRepo.AjouterTacheCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.TacheCore
                    {
                        Id = "TSK001",
                        ProjetId = "PRJ001",
                        Titre = "Configuration VPC",
                        Description = "Mise en place du réseau virtuel",
                        Priorite = "Haute",
                        Statut = "To Do",
                        DateLimite = DateTime.Now.AddDays(5),
                        Actif = true
                    });
                    await tacheRepo.AjouterTacheCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.TacheCore
                    {
                        Id = "TSK002",
                        ProjetId = "PRJ001",
                        Titre = "Setup EC2",
                        Description = "Provisionnement des instances",
                        Priorite = "Moyenne",
                        Statut = "In Progress",
                        DateLimite = DateTime.Now.AddDays(7),
                        Actif = true
                    });
                    await tacheRepo.AjouterTacheCoreAsync(new Gestprojet.Core.ApiParamSociete.Domain.Models.TacheCore
                    {
                        Id = "TSK003",
                        ProjetId = "PRJ002",
                        Titre = "Maquettes Figma",
                        Description = "Design des pages principales",
                        Priorite = "Haute",
                        Statut = "Done",
                        DateLimite = DateTime.Now.AddDays(-1),
                        Actif = true
                    });
                } catch(Exception ex) { Log($"Skipping Tasks: {ex.Message}"); }
            }
        }
        catch (Exception ex)
        {
            Log($"ERROR: Seeding Exception: {ex.Message}");
            if (ex.InnerException != null) Log($"INNER ERROR: {ex.InnerException.Message}");
        }
        
        Log("Database Seeding: Finished.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Seeding failed: {ex.Message}");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Gestprojet.Core.ApiParamSociete.WebApi.Hubs.NotificationHub>("/hubs/notifications");

app.Run();
