using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Commun
{
    public static class SoftProOutils
    {
        public static Gestprojet.Core.ApiParamSociete.Client.Model.CritereRecherche ToCritereSociete(ConditionRecherche conditionRecherche)
        {
            Gestprojet.Core.ApiParamSociete.Client.Model.CritereRecherche critereRecherche = new Gestprojet.Core.ApiParamSociete.Client.Model.CritereRecherche();
            critereRecherche.Criteres = conditionRecherche.Criteres;
            return critereRecherche;
        }

    }
}
