using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class ApplicationDetailles
    {
        public ApplicationCore Application { get; set; }
        public UtilisateurCore Utilisateur { get; set; }
    }
}
