using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class TacheAssignationCoreMapper
    {
        public static object GetParameters(TacheAssignationCore tacheAssignationCore)
        {
            return new
            {
                tacheAssignationCore.Id,
                tacheAssignationCore.TacheId,
                tacheAssignationCore.UtilisateurId,
                tacheAssignationCore.Actif,
            };
        }
    }
}
