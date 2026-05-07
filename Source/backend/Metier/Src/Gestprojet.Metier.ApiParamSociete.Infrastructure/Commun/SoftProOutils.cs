using System.Collections.Generic;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Commun
{
    public static class SoftProOutils
    {
        public static Gestprojet.Core.ApiParamSociete.Client.Model.CritereRecherche ToCritereSociete(ConditionRecherche conditionRecherche)
        {
            var critereRecherche = new Gestprojet.Core.ApiParamSociete.Client.Model.CritereRecherche();
            if (conditionRecherche == null)
            {
                critereRecherche.Criteres = new Dictionary<string, string>();
                return critereRecherche;
            }
            critereRecherche.Criteres = conditionRecherche.Criteres ?? new Dictionary<string, string>();
            return critereRecherche;
        }

    }
}
