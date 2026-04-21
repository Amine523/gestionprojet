using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class AttachementDetailles
    {
        public AttachementCore Attachement { get; set; }
        public TacheCore TacheId { get; set; }
        public ProjetCore ProjetId { get; set; }
    }
}
