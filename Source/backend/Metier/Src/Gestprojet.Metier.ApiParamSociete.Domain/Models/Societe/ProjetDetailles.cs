using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class ProjetDetailles
    {
        public ProjetCore Projet { get; set; }
        public UtilisateurCore Utilisateur { get; set; }
        
        // Intelligence Fields
        public double AvanceeCalculee { get; set; }
        public int HealthScore { get; set; } // 0-100
        public string HealthColor { get; set; } // Vert, Orange, Rouge
        public DateTime? EndDatePredicted { get; set; }
        public string PerformanceTrend { get; set; } // Stable, Improving, Declining
    }
}
