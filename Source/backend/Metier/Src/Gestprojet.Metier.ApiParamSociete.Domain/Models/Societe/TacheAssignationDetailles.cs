using Gestprojet.Core.ApiParamSociete.Client.Model;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe
{
    public class TacheAssignationDetailles
    {
        public TacheAssignationCore TacheAssignation { get; set; }
        public TacheAssignationCore TacheId { get; set; }
        public UtilisateurCore UtilisateurId { get; set; }
    }
}
