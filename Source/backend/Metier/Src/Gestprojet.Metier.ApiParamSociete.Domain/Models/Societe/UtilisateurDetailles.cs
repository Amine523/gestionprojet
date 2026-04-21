using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class UtilisateurDetailles
    {
        public UtilisateurCore Utilisateur { get; set; }
        public TypeUtilisateurCore TypeUtilisateurId { get; set; }
        public SocieteCore SocieteId { get; set; }
        public RoleCore RoleId { get; set; }
    }
}
