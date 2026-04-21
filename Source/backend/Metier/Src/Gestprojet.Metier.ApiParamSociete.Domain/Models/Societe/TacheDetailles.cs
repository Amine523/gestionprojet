using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class TacheDetailles
    {
        public TacheCore Tache { get; set; }
        public ProjetCore ProjetId { get; set; }
    }
}
