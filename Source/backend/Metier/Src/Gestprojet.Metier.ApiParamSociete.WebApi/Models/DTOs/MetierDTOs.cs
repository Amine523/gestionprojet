using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs
{
    // Evaluation DTOs
    public class EvaluationRequestDTO
    {
        [Required]
        public string Role { get; set; } = "candidate"; // candidate, developer, testeur, employee
        public string? Context { get; set; }
        [Required]
        public EvaluationDataDTO Data { get; set; } = new();
        public bool UseAI { get; set; } = false;
    }

    public class EvaluationDataDTO
    {
        public decimal TechnicalScore { get; set; } = 0;
        public decimal TestResults { get; set; } = 0;
        public int TasksCompleted { get; set; } = 0;
        public int TasksDelayed { get; set; } = 0;
        public decimal AttendanceRate { get; set; } = 100;
        public int AbsenceDays { get; set; } = 0;
        public decimal ProjectProgress { get; set; } = 0;
        public decimal CodeQuality { get; set; } = 0;
        public int BugCount { get; set; } = 0;
        public decimal CommunicationScore { get; set; } = 0;
        public int Experience { get; set; } = 0;
        public List<string> Skills { get; set; } = new();
    }

    public class EvaluationResponseDTO
    {
        public decimal ScoreSur20 { get; set; }
        public string Mention { get; set; } = "";
        public List<string> Strengths { get; set; } = new();
        public List<string> Weaknesses { get; set; } = new();
        public string RiskLevel { get; set; } = "";
        public string Decision { get; set; } = "";
        public EvaluationDetailsDTO Details { get; set; } = new();
        public string Feedback { get; set; } = "";
        public List<string> Ameliorations { get; set; } = new();
        public DateTime EvaluationDate { get; set; } = DateTime.UtcNow;
    }

    public class EvaluationDetailsDTO
    {
        public decimal Technique { get; set; }
        public decimal Productivite { get; set; }
        public decimal Discipline { get; set; }
        public decimal Qualite { get; set; }
    }

    // Project Stats DTOs
    public class ProjectStatsDTO
    {
        public string ProjectId { get; set; } = string.Empty;
        public string ProjectNom { get; set; } = string.Empty;
        public int TotalTaches { get; set; }
        public int TachesToDo { get; set; }
        public int TachesInProgress { get; set; }
        public int TachesDone { get; set; }
        public double PourcentageAvancement { get; set; }
        public decimal? TotalTempsEstime { get; set; }
        public decimal? TotalTempsReel { get; set; }
        public int TachesEnRetard { get; set; }
        public bool EstEnRetard { get; set; }
    }

    // RH Stats DTOs
    public class RHStatsDTO
    {
        public int TotalEmployes { get; set; }
        public int EmployesActifs { get; set; }
        public int EmployesAbsents { get; set; }
        public decimal TotalHeuresAujourdhui { get; set; }
        public int DemandesCongesEnAttente { get; set; }
        public int CongesValidesCeMois { get; set; }
        public decimal TauxPresence { get; set; }
    }

    public class SoldeCongeDTO
    {
        public string UtilisateurId { get; set; } = string.Empty;
        public string UtilisateurNom { get; set; } = string.Empty;
        public decimal SoldeTotal { get; set; }
        public decimal SoldeUtilise { get; set; }
        public decimal SoldeRestant { get; set; }
        public int CongesEnAttente { get; set; }
        public int CongesValides { get; set; }
        public int CongesRefuses { get; set; }
    }

    // Task DTOs for EnhancedTaches
    public class TacheKanbanDTO
    {
        public string ColumnId { get; set; } = "";
        public string ColumnName { get; set; } = "";
        public List<object> Taches { get; set; } = new();
        public int Count { get; set; }
    }

    public class UpdateStatusDTO
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }

    public class AssignTaskDTO
    {
        [Required]
        public List<string> AssigneeIds { get; set; } = new();
    }

    public class AddCommentDTO
    {
        [Required]
        public string Comment { get; set; } = string.Empty;
        public string Type { get; set; } = "dev"; // "dev" or "test"
    }

    // RH Request DTOs
    public class ClockInRequest
    {
        [Required(ErrorMessage = "UtilisateurId est requis")]
        public string UtilisateurId { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "SocieteId est requis")]
        public string SocieteId { get; set; } = string.Empty;
        
        public string TypeId { get; set; } = "NORMAL";
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
    }

    public class ClockOutRequest
    {
        [Required(ErrorMessage = "UtilisateurId est requis")]
        public string UtilisateurId { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "SocieteId est requis")]
        public string SocieteId { get; set; } = string.Empty;
        
        public string? Note { get; set; }
    }
}
