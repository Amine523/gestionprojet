
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class SoftProExtensions
    {
        /// <summary>
        /// Génère une condition SQL à partir d'un objet CritereRecherche
        /// </summary>
        public static string ToSqlCondition(CritereRecherche critereRecherche)
        {
            if (critereRecherche == null)
                return string.Empty;

            List<string> conditions = new List<string>();

            if (!string.IsNullOrEmpty(critereRecherche.Id))
                conditions.Add($"Id = '{critereRecherche.Id}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.UtilisateurId))
                conditions.Add($"UtilisateurId = '{critereRecherche.UtilisateurId}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.SocieteId))
                conditions.Add($"SocieteId = '{critereRecherche.SocieteId}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.ProjetId))
                conditions.Add($"ProjetId = '{critereRecherche.ProjetId}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.TypeUtilisateurId))
                conditions.Add($"TypeUtilisateurId = '{critereRecherche.TypeUtilisateurId}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.Status))
                conditions.Add($"Status = '{critereRecherche.Status}'");
            
            if (!string.IsNullOrEmpty(critereRecherche.Nom))
                conditions.Add($"Nom LIKE '%{critereRecherche.Nom}%'");
            
            if (!string.IsNullOrEmpty(critereRecherche.Email))
                conditions.Add($"Email LIKE '%{critereRecherche.Email}%'");

            // Handle additional criteres from dictionary
            if (critereRecherche.Criteres != null)
            {
                foreach (var critere in critereRecherche.Criteres)
                {
                    conditions.Add($"{critere.Key} = '{critere.Value}'");
                }
            }

            return string.Join(" AND ", conditions);
        }
    }
}
