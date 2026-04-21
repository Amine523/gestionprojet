using Microsoft.AspNetCore.Mvc;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/rh/enhanced")]
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAllWithCredentials")]
    public class EnhancedRHController : ControllerBase
    {
        private readonly RHCalculationService _rhCalculationService;

        public EnhancedRHController(RHCalculationService rhCalculationService)
        {
            _rhCalculationService = rhCalculationService;
        }

        [HttpGet("societe/{societeId}/stats")]
        public async Task<IActionResult> GetRHStats(string societeId)
        {
            try
            {
                var stats = await _rhCalculationService.CalculateRHStatsAsync(societeId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul des statistiques RH", message = ex.Message });
            }
        }

        [HttpGet("utilisateur/{utilisateurId}/solde-conge")]
        public async Task<IActionResult> GetSoldeConge(string utilisateurId)
        {
            try
            {
                var solde = await _rhCalculationService.CalculateSoldeCongeAsync(utilisateurId);
                return Ok(solde);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = $"Utilisateur {utilisateurId} non trouvé" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul du solde de congés", message = ex.Message });
            }
        }

        [HttpGet("utilisateur/{utilisateurId}/heures-travaillees")]
        public async Task<IActionResult> GetHeuresTravaillees(string utilisateurId, [FromQuery] DateTime date)
        {
            try
            {
                var hours = await _rhCalculationService.CalculateWorkedHoursAsync(utilisateurId, date);
                return Ok(new { utilisateurId, date, hours });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du calcul des heures travaillées", message = ex.Message });
            }
        }

        [HttpGet("societe/{societeId}/soldes-conges")]
        public async Task<IActionResult> GetAllSoldesConges(string societeId)
        {
            try
            {
                var soldes = await _rhCalculationService.GetSoldesCongesAsync(societeId);
                return Ok(soldes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de la récupération des soldes de congés", message = ex.Message });
            }
        }

        [HttpPost("clock-in")]
        public async Task<IActionResult> ClockIn([FromBody] ClockInRequest request)
        {
            try
            {
                var result = await _rhCalculationService.ClockInAsync(request);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du pointage (entrée)", message = ex.Message });
            }
        }

        [HttpPost("clock-out")]
        public async Task<IActionResult> ClockOut([FromBody] ClockOutRequest request)
        {
            try
            {
                var result = await _rhCalculationService.ClockOutAsync(request);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors du pointage (sortie)", message = ex.Message });
            }
        }

        [HttpPost("demande-conge")]
        public async Task<IActionResult> CreateDemandeConge([FromBody] Gestprojet.Core.ApiParamSociete.Client.Model.DemandeCongeCore dto)
        {
            try
            {
                var result = await _rhCalculationService.CreateDemandeCongeAsync(dto);
                return result.Success ? Ok(result) : BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de la création de la demande de congé", message = ex.Message });
            }
        }
    }
}
