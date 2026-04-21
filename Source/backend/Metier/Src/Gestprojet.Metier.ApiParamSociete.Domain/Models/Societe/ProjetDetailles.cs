using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class ProjetDetailles
    {
        public ProjetCore Projet { get; set; }
        public UtilisateurCore UtilisateurId { get; set; }
    }
}
