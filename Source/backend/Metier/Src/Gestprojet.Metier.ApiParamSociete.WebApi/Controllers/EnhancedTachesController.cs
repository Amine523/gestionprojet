using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.WebApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/taches/enhanced")]
    public class EnhancedTachesController : ControllerBase
    {
        private readonly ITacheBusiness _tacheBusiness;
        private readonly ITacheAssignationBusiness _tacheAssignationBusiness;
        private readonly IProjetBusiness _projetBusiness;
        private readonly INotificationService _notificationService;
        private readonly ILogger<EnhancedTachesController> _logger;

        public EnhancedTachesController(
            ITacheBusiness tacheBusiness,
            ITacheAssignationBusiness tacheAssignationBusiness,
            IProjetBusiness projetBusiness,
            INotificationService notificationService,
            ILogger<EnhancedTachesController> logger)
        {
            _tacheBusiness = tacheBusiness;
            _tacheAssignationBusiness = tacheAssignationBusiness;
            _projetBusiness = projetBusiness;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet("kanban/{projetId}")]
        public async Task<IActionResult> GetKanbanTasks(string projetId)
        {
            try
            {
                var allTaches = await _tacheBusiness.ListeAsync();
                var taches = allTaches.Where(t => t.ProjetId == projetId && t.Actif == true).ToList();

                var kanbanColumns = new List<TacheKanbanDTO>
                {
                    new TacheKanbanDTO
                    {
                        ColumnId = "todo",
                        ColumnName = "À faire",
                        Taches = taches.Where(t => t.Statut == "To Do" || t.Statut == "À faire" || t.Statut == "todo").Cast<object>().ToList(),
                        Count = taches.Count(t => t.Statut == "To Do" || t.Statut == "À faire" || t.Statut == "todo")
                    },
                    new TacheKanbanDTO
                    {
                        ColumnId = "inprogress",
                        ColumnName = "En cours",
                        Taches = taches.Where(t => t.Statut == "In Progress" || t.Statut == "En cours" || t.Statut == "inprogress").Cast<object>().ToList(),
                        Count = taches.Count(t => t.Statut == "In Progress" || t.Statut == "En cours" || t.Statut == "inprogress")
                    },
                    new TacheKanbanDTO
                    {
                        ColumnId = "done",
                        ColumnName = "Terminé",
                        Taches = taches.Where(t => t.Statut == "Done" || t.Statut == "Terminé" || t.Statut == "done").Cast<object>().ToList(),
                        Count = taches.Count(t => t.Statut == "Done" || t.Statut == "Terminé" || t.Statut == "done")
                    }
                };

                return Ok(kanbanColumns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Kanban tasks");
                return StatusCode(500, new { error = "Failed to get Kanban tasks" });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Status))
                return BadRequest(new { error = "Status is required" });

            try
            {
                var tache = await _tacheBusiness.ObtenirAsync(id);
                if (tache == null) return NotFound();

                var oldStatus = tache.Statut;
                tache.Statut = dto.Status;
                await _tacheBusiness.AjouterOuModifierAsync(tache);

                // Notify via SignalR
                await _notificationService.SendToProjectAsync(tache.ProjetId, 
                    "Statut de tâche modifié", 
                    $"La tâche '{tache.Titre}' est passée de '{oldStatus}' à '{dto.Status}'");

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task status");
                return StatusCode(500, new { error = "Failed to update task status" });
            }
        }

        [HttpPost("{id}/assign")]
        public async Task<IActionResult> AssignTask(string id, [FromBody] AssignTaskDTO dto)
        {
            if (dto.AssigneeIds == null || !dto.AssigneeIds.Any())
                return BadRequest(new { error = "At least one assignee is required" });

            try
            {
                var tache = await _tacheBusiness.ObtenirAsync(id);
                if (tache == null) return NotFound();

                await _notificationService.SendToProjectAsync(tache.ProjetId,
                    "Nouvelle assignation",
                    $"De nouveaux collaborateurs ont été assignés à la tâche '{tache.Titre}'");

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning task");
                return StatusCode(500, new { error = "Failed to assign task" });
            }
        }
    }
}
