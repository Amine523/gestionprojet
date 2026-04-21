using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class ProjetUtilisateurDetailles
    {
        public ProjetUtilisateurCore ProjetUtilisateur { get; set; }
        public ProjetCore ProjetId { get; set; }
        public UtilisateurCore UtilisateurId { get; set; }
    }
}
