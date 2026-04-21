namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class TacheAssignationCore
    {
        public string Id { get; set; }
        public string TacheId { get; set; }
        public string UtilisateurId { get; set; }
        public bool? Actif { get; set; }
    }
}