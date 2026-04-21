using System.Collections.Generic;

namespace Gestprojet.Core.ApiParamSociete.Domain.Models.Commun
{
    public class CritereRecherche
    {
        public string? Id { get; set; }
        public string? UtilisateurId { get; set; }
        public string? SocieteId { get; set; }
        public string? ProjetId { get; set; }
        public string? TypeUtilisateurId { get; set; }
        public string? Status { get; set; }
        public string? Nom { get; set; }
        public string? Email { get; set; }
        public string? Propriete { get; set; }
        public string? Operateur { get; set; }
        public string? Valeur { get; set; }
        public Dictionary<string, string> Criteres { get; set; } = new Dictionary<string, string>();
    }
}
