using System;
using System.ComponentModel.DataAnnotations;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class TestCore
    {
        [Key]
        public string Id { get; set; } = "";
        public string Titre { get; set; } = "";
        public string? Description { get; set; }
        public string? TypeTest { get; set; }
        public int DureeMinutes { get; set; } = 60;
        public decimal ScoreMinimum { get; set; } = 50;
        public string? SocieteId { get; set; }
        public string? CreeParId { get; set; }
        public string? Poste { get; set; }
        public bool Actif { get; set; } = true;
        public DateTime? DateCreation { get; set; }
    }

    public class QuestionCore
    {
        [Key]
        public string Id { get; set; } = "";
        public string TestId { get; set; } = "";
        public string Texte { get; set; } = "";
        public string? TypeQuestion { get; set; }
        public decimal Points { get; set; } = 1;
        public int Ordre { get; set; } = 0;
        public bool Actif { get; set; } = true;
    }

    public class ReponseCore
    {
        [Key]
        public string Id { get; set; } = "";
        public string QuestionId { get; set; } = "";
        public string Texte { get; set; } = "";
        public bool EstCorrecte { get; set; } = false;
        public int Ordre { get; set; } = 0;
    }

    public class TestResultCore
    {
        [Key]
        public string Id { get; set; } = "";
        public string TestId { get; set; } = "";
        public string UtilisateurId { get; set; } = "";
        public string? ApplicationId { get; set; }
        public decimal Score { get; set; } = 0;
        public decimal Pourcentage { get; set; } = 0;
        public bool EstPasse { get; set; } = false;
        public int? TempsEcouleMinutes { get; set; }
        public DateTime? DateDebut { get; set; }
        public DateTime? DateFin { get; set; }
        public string? ReponsesJson { get; set; }
        public DateTime? DateCreation { get; set; }
    }
}