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
    [Microsoft.AspNetCore.Cors.EnableCors("AllowAll")]
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
        public async Task<IActionResult> GetHeuresTravaillees(string utilisateurId, [FromQuery] DateTime? date, [FromQuery] DateTime? now)
        {
            try
            {
                var targetDate = date ?? DateTime.Today;
                var currentNow = now ?? DateTime.Now;
                var hours = await _rhCalculationService.CalculateWorkedHoursAsync(utilisateurId, targetDate, currentNow);
                return Ok(new { utilisateurId, date = targetDate, hours });
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

        [HttpPost("demandes-conge/{id}/valider")]
        public async Task<IActionResult> ValiderDemandeConge(string id, [FromBody] ValiderCongeRequest request)
        {
            try
            {
                var dto = new Gestprojet.Core.ApiParamSociete.Client.Model.DemandeCongeCore
                {
                    Id = id,
                    Status = request.Accepted ? "Validée" : "Refusée",
                    ValideParId = request.AdminId
                };
                var result = await _rhCalculationService.CreateDemandeCongeAsync(dto);
                return Ok(new { success = true, message = request.Accepted ? "Demande approuvée" : "Demande refusée" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de la validation", message = ex.Message });
            }
        }

        [HttpPost("utilisateur/{utilisateurId}/ajustement-conge")]
        public IActionResult AjusterConge(string utilisateurId, [FromBody] AjustementCongeDTO request)
        {
            try
            {
                _rhCalculationService.UpdateCongeInfo(utilisateurId, request.DateEmbauche, request.SoldeAjustement);
                return Ok(new { success = true, message = "Ajustement enregistré avec succès." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de l'ajustement du solde", message = ex.Message });
            }
        }

        [HttpPost("demandes-conge/{id}/justificatif")]
        public async Task<IActionResult> UploadJustificatif(string id, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0) return BadRequest("Fichier manquant");
                var uploads = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "uploads", "justificatifs");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);
                var fileName = $"JUST_{id}_{Guid.NewGuid():N}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return Ok(new { success = true, path = $"uploads/justificatifs/{fileName}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de l'upload", message = ex.Message });
            }
        }

        // ─── Rapport de présence ────────────────────────────────────────────────────
        [HttpGet("societe/{societeId}/rapport-presence")]
        public async Task<IActionResult> GetRapportPresence(
            string societeId,
            [FromQuery] int mois,
            [FromQuery] int annee,
            [FromQuery] string format = "csv")
        {
            try
            {
                var stats = await _rhCalculationService.CalculateRapportPresenceAsync(societeId, mois, annee);

                if (format?.ToLower() == "html")
                {
                    var html = BuildHtmlReport(stats, societeId, mois, annee);
                    return Content(html, "text/html");
                }

                // Default: CSV
                var csv = BuildCsvReport(stats, mois, annee);
                var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
                return File(bytes, "text/csv", $"presence_{societeId}_{annee}_{mois:D2}.csv");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erreur lors de la génération du rapport", message = ex.Message });
            }
        }

        private string BuildCsvReport(IEnumerable<RapportPresenceDTO> rows, int mois, int annee)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("Employé,Jours Travaillés,Heures Totales,Jours Congé,Jours Absent,Taux Présence (%)");
            foreach (var r in rows)
            {
                sb.AppendLine($"{r.NomComplet},{r.JoursTravailles},{r.HeuresTotales:F1},{r.JoursConge},{r.JoursAbsent},{r.TauxPresence:F0}");
            }
            return sb.ToString();
        }

        private string BuildHtmlReport(IEnumerable<RapportPresenceDTO> rows, string societeId, int mois, int annee)
        {
            var moisNom = new System.Globalization.CultureInfo("fr-FR").DateTimeFormat.GetMonthName(mois);
            var sb = new System.Text.StringBuilder();
            sb.Append($@"<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'>
<title>Rapport Présence – {moisNom} {annee}</title>
<style>
  body{{font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:32px;color:#1e293b}}
  h1{{color:#4f46e5;margin-bottom:4px}}
  .subtitle{{color:#64748b;margin-bottom:24px}}
  table{{width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}}
  th{{background:#4f46e5;color:white;padding:14px 16px;text-align:left;font-size:13px;text-transform:uppercase;letter-spacing:.04em}}
  td{{padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px}}
  tr:last-child td{{border-bottom:none}}
  .badge{{display:inline-block;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600}}
  .green{{background:#d1fae5;color:#059669}}
  .red{{background:#fee2e2;color:#dc2626}}
  .yellow{{background:#fef9c3;color:#ca8a04}}
</style></head><body>
<h1>📊 Rapport de Présence</h1>
<p class='subtitle'>Société: {societeId} &nbsp;|&nbsp; Période: {moisNom} {annee}</p>
<table><thead><tr>
  <th>Employé</th><th>Jours Travaillés</th><th>Heures Totales</th><th>Congés</th><th>Absences</th><th>Taux Présence</th>
</tr></thead><tbody>");
            foreach (var r in rows)
            {
                var badgeClass = r.TauxPresence >= 80 ? "green" : r.TauxPresence >= 50 ? "yellow" : "red";
                sb.Append($@"<tr>
  <td><strong>{r.NomComplet}</strong></td>
  <td>{r.JoursTravailles}</td>
  <td>{r.HeuresTotales:F1}h</td>
  <td>{r.JoursConge}</td>
  <td>{r.JoursAbsent}</td>
  <td><span class='badge {badgeClass}'>{r.TauxPresence:F0}%</span></td>
</tr>");
            }
            sb.Append("</tbody></table></body></html>");
            return sb.ToString();
        }
    }

    public class ValiderCongeRequest
    {
        public string AdminId { get; set; } = string.Empty;
        public bool Accepted { get; set; }
    }
}

