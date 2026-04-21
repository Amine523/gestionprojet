using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Microsoft.AspNetCore.Authorization;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers.Societe
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportingController : ControllerBase
    {
        private readonly IUtilisateurBusiness _utilisateurBusiness;
        private readonly IProjetBusiness _projetBusiness;
        private readonly IApplicationBusiness _applicationBusiness;

        public ReportingController(
            IUtilisateurBusiness utilisateurBusiness,
            IProjetBusiness projetBusiness,
            IApplicationBusiness applicationBusiness)
        {
            _utilisateurBusiness = utilisateurBusiness;
            _projetBusiness = projetBusiness;
            _applicationBusiness = applicationBusiness;
        }

        [HttpGet("payslip/{utilisateurId}")]
        public async Task<IActionResult> GetPayslip(string utilisateurId)
        {
            var user = await _utilisateurBusiness.ObtenirAsync(utilisateurId);
            if (user == null) return NotFound("Employé introuvable");

            // Simulation de données de paie pour le PFE
            var payslip = new
            {
                EmployeeName = user.Nom,
                EmployeeEmail = user.Email,
                Month = DateTime.Now.ToString("MMMM yyyy"),
                BaseSalary = 2500.00,
                Bonuses = 250.00,
                Deductions = 150.00,
                NetSalary = 2600.00,
                GeneratedAt = DateTime.Now
            };

            return Ok(payslip);
        }

        [HttpGet("project-summary/{projetId}")]
        public async Task<IActionResult> GetProjectSummary(string projetId)
        {
            var projet = await _projetBusiness.ObtenirAsync(projetId);
            if (projet == null) return NotFound("Projet introuvable");

            // Simulation de statistiques de projet
            var summary = new
            {
                ProjectName = projet.Nom,
                Status = projet.Status,
                CompletionRate = 75.5,
                TotalTasks = 20,
                CompletedTasks = 15,
                TeamSize = 5,
                BudgetStatus = "On Track",
                LastActivity = DateTime.Now.AddDays(-1)
            };

            return Ok(summary);
        }

        [HttpGet("recruitment-stats")]
        public async Task<IActionResult> GetRecruitmentStats()
        {
            var candidatures = await _applicationBusiness.ListeAsync();
            var stats = new
            {
                TotalCandidatures = candidatures.Count(),
                EnAttente = candidatures.Count(c => c.Statut == "EN_ATTENTE"),
                TestsTermines = candidatures.Count(c => c.Statut == "TEST_TERMINE"),
                Acceptes = candidatures.Count(c => c.Statut == "ACCEPTE"),
                Refuses = candidatures.Count(c => c.Statut == "REJETE")
            };

            return Ok(stats);
        }
    }
}
