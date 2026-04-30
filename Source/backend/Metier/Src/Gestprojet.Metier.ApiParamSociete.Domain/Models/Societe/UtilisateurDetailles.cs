using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class UtilisateurDetailles
    {
        public UtilisateurCore Utilisateur { get; set; }
        public TypeUtilisateurCore TypeUtilisateurId { get; set; }
        public SocieteCore SocieteId { get; set; }
        public RoleCore RoleId { get; set; }

        // HR Intelligence Metrics
        public double PerformanceScore { get; set; } // 0-100
        public double QualityScore { get; set; }
        public double TimelinessScore { get; set; }
        public double CollaborationScore { get; set; }
        public System.Collections.Generic.Dictionary<string, int> SkillsMatrix { get; set; }
        public string BurnoutRisk { get; set; }
        public double CurrentWorkloadHours { get; set; }
    }
}
