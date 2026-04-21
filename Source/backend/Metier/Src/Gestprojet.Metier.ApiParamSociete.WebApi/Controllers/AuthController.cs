using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IUtilisateurBusiness _utilisateurBusiness;
        private readonly IConfiguration _configuration;

        public AuthController(IUtilisateurBusiness utilisateurBusiness, IConfiguration configuration)
        {
            _utilisateurBusiness = utilisateurBusiness;
            _configuration = configuration;
        }

        [HttpPost("register-candidate")]
        public async Task<IActionResult> RegisterCandidate([FromBody] RegisterRequest request)
        {
            if (request == null) return BadRequest(new { Message = "Données invalides" });
            
            var user = new UtilisateurCore
            {
                Id = "CAND_" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                Nom = request.Nom,
                Email = request.Email,
                MotDePasse = request.Password, // Ideally hash this
                TypeUtilisateurId = "T007", // Candidat
                SocieteId = "SP001", // Default society for recruitment
                Actif = true
            };

            var result = await _utilisateurBusiness.AjouterOuModifierAsync(user);
            
            if (result.Success)
            {
                var token = GenererJwtToken(user);
                return Ok(new { Token = token, Utilisateur = user });
            }
            
            return BadRequest(new { Message = result.Message });
        }

        public class RegisterRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string Nom { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            System.Console.WriteLine($"[AUTH] Login attempt for: {request.Email}");

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { Message = "Email et mot de passe requis." });

            // MASTER LOGIN for emergency / development
            if ((request.Email == "admin" || request.Email == "admin@gestprojet.com") && 
                (request.Password == "admin" || request.Password == "admin123"))
            {
                System.Console.WriteLine("[AUTH] Master login detected");
                var masterUser = new UtilisateurCore
                {
                    Id = "ADMIN_MASTER",
                    Nom = "Admin Master",
                    Email = "admin@gestprojet.com",
                    TypeUtilisateurId = "T001",
                    SocieteId = "SP001",
                    Actif = true
                };
                return Ok(new { Token = GenererJwtToken(masterUser), Utilisateur = masterUser });
            }

            try 
            {
                var utilisateurs = await _utilisateurBusiness.ListeAsync();
                System.Console.WriteLine($"[AUTH] Fetched {utilisateurs?.Count() ?? 0} users from Core");
                
                var utilisateur = utilisateurs.FirstOrDefault(u => u.Email == request.Email);

                if (utilisateur == null)
                {
                    System.Console.WriteLine($"[AUTH] User not found: {request.Email}");
                    // Second Master/Mock check
                    if (request.Password == "SoftPro" || request.Password == "admin123")
                    {
                         string mockRole = "T005";
                         if (request.Email.ToLower().Contains("admin")) mockRole = "T001";
                         else if (request.Email.ToLower().Contains("rh")) mockRole = "T003";
                         else if (request.Email.ToLower().Contains("chef")) mockRole = "T004";
                         else if (request.Email.ToLower().Contains("test")) mockRole = "T006";

                         System.Console.WriteLine($"[AUTH] Using MOCK user for known password with role {mockRole}");
                         utilisateur = new UtilisateurCore
                         {
                             Id = "MOCK_" + mockRole,
                             Nom = "Demo User (" + mockRole + ")",
                             Email = request.Email,
                             TypeUtilisateurId = mockRole,
                             SocieteId = "SP001",
                             Actif = true
                         };
                    }
                    else
                    {
                        return Unauthorized(new { Message = "Utilisateur introuvable ou inactif." });
                    }
                }
                else
                {
                    System.Console.WriteLine($"[AUTH] User found, verifying password for {utilisateur.Email}");
                    bool isPasswordValid = false;
                    
                    // DEV MODE: Skip password check for development
                    if (true) // Change to false in production
                    {
                        isPasswordValid = true;
                    }
                    else
                    {
                        try
                        {
                            isPasswordValid = VerifyPassword(request.Password, utilisateur.MotDePasse);
                        }
                        catch
                        {
                            isPasswordValid = utilisateur.MotDePasse == request.Password;
                        }
                    }

                    if (!isPasswordValid)
                    {
                        System.Console.WriteLine("[AUTH] Invalid password");
                        return Unauthorized(new { Message = "Mot de passe incorrect." });
                    }
                }

                var token = GenererJwtToken(utilisateur);
                System.Console.WriteLine("[AUTH] Login successful");
                return Ok(new
                {
                    Token = token,
                    Utilisateur = new
                    {
                        utilisateur.Id,
                        utilisateur.Nom,
                        utilisateur.Email,
                        utilisateur.TypeUtilisateurId,
                        utilisateur.SocieteId,
                        utilisateur.Actif
                    }
                });
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[AUTH] ERROR: {ex.Message}");
                return StatusCode(500, new { Message = "Erreur lors de la connexion", Details = ex.Message });
            }
        }

        private string GenererJwtToken(UtilisateurCore utilisateur)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"] ?? jwtSettings["SecretKey"] ?? "DefaultSecretKey12345678901234567890";
            var issuer = jwtSettings["Issuer"] ?? "Gestprojet.Metier.ApiParamSociete.WebApi";
            var audience = jwtSettings["Audience"] ?? "Gestprojet.Metier.ApiParamSociete.Client";
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, utilisateur.Id ?? ""),
                new Claim(ClaimTypes.Email, utilisateur.Email ?? ""),
                new Claim(ClaimTypes.Role, utilisateur.TypeUtilisateurId ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: System.DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            if (storedHash == null) return false;
            if (storedHash.StartsWith("$2"))
            {
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            return storedHash == password;
        }
    }
}