namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ProjetUtilisateurCore
    {
        public string Id { get; set; }
        public string ProjetId { get; set; }
        public string UtilisateurId { get; set; }
        public bool? Actif { get; set; }
    }
}