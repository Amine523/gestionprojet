using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class PointageDetailles
    {
        public PointageCore Pointage { get; set; }
        public UtilisateurCore UtilisateurId { get; set; }
        public TypeCore TypeId { get; set; }
    }
}
