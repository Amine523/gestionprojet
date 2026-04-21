using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Commun;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IUtilisateurCoreBusiness _utilisateurBusiness;
        private readonly ITypeUtilisateurCoreBusiness _typeUtilisateurBusiness;
        private readonly IConfiguration _configuration;

        public AuthController(IUtilisateurCoreBusiness utilisateurBusiness, ITypeUtilisateurCoreBusiness typeUtilisateurBusiness, IConfiguration configuration)
        {
            _utilisateurBusiness = utilisateurBusiness;
            _typeUtilisateurBusiness = typeUtilisateurBusiness;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { Message = "Email et mot de passe requis." });

            var utilisateur = await _utilisateurBusiness.ObtenirUtilisateurParEmailAsync(request.Email);
            if (utilisateur == null || !utilisateur.Actif.GetValueOrDefault(true))
            {
                // Fallback for mocked frontend users that aren't in DB yet during this transition
                if (request.Password == "admin123" || request.Password == "pass123")
                {
                   utilisateur = new UtilisateurCore {
                       Id = "MOCK_SYNC_USR",
                       Nom = "Synchronized Demo User",
                       Email = request.Email,
                       TypeUtilisateurId = "T005", // Dev default
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
                // Verify real database password
                bool isPasswordValid = false;
                try
                {
                    isPasswordValid = SecurityUtils.VerifyPassword(request.Password, utilisateur.MotDePasse);
                }
                catch
                {
                    // Fallback for unhashed legacy records
                    isPasswordValid = utilisateur.MotDePasse == request.Password;
                }

                if (!isPasswordValid)
                    return Unauthorized(new { Message = "Mot de passe incorrect." });
            }

            // Génération JWT
            var permissions = GetPermissionsByRole(utilisateur.TypeUtilisateurId);
            var token = GenererJwtToken(utilisateur);

            return Ok(new
            {
                token = token,
                utilisateur = utilisateur,
                permissions = permissions
            });
        }

        private string GenererJwtToken(UtilisateurCore utilisateur)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyString = jwtSettings["Key"] ?? "DefaultSecretKey12345678901234567890";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            
            var roleId = utilisateur.TypeUtilisateurId ?? "T007";
            var roleName = roleId switch
            {
                "T001" => "SuperAdmin",
                "T002" => "AdminSociete",
                "T003" => "RH",
                "T004" => "ChefProjet",
                "T005" => "Developer",
                "T006" => "Tester",
                _ => "User"
            };
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, utilisateur.Id),
                new Claim(JwtRegisteredClaimNames.Email, utilisateur.Email),
                new Claim(ClaimTypes.Role, roleId),
                new Claim("roleName", roleName),
                new Claim("nom", utilisateur.Nom ?? ""),
                new Claim("societeId", utilisateur.SocieteId ?? "")
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private List<string> GetPermissionsByRole(string typeUtilisateurId)
        {
            // Map French role names to IDs for backwards compatibility
            var roleId = typeUtilisateurId switch
            {
                "Administrateur" or "T001" => "T001",
                "Admin Société" or "Admin Societe" or "T002" => "T002",
                "RH" or "T003" => "T003",
                "Chef de Projet" or "Chef Projet" or "T004" => "T004",
                "Développeur" or "Developpeur" or "T005" => "T005",
                "Testeur" or "T006" => "T006",
                "Utilisateur" or "T007" => "T007",
                _ => typeUtilisateurId
            };
            
            return roleId switch
            {
                "T001" => new List<string> { "all" },
                "T002" => new List<string> { "admin", "users", "projets", "rh", "paiements", "parametres", "conges" },
                "T003" => new List<string> { "rh", "employes", "conges", "recrutement", "pointage" },
                "T004" => new List<string> { "chef", "projets", "taches", "equipe", "suivi", "rapports", "conges" },
                "T005" => new List<string> { "dev", "taches", "projets", "time", "docs", "conges" },
                "T006" => new List<string> { "qa", "tests", "bugs", "plans", "rapports", "conges" },
                _ => new List<string> { "user" }
            };
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var types = await _typeUtilisateurBusiness.ListeTypeUtilisateurAsync();
            var roles = types.Select(t => new { id = t.Id, nom = t.Nom, description = t.Description }).ToList();
            return Ok(roles);
        }
    }
}
