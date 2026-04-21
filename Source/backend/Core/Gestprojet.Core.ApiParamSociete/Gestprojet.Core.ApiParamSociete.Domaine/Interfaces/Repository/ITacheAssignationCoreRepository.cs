using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface ITacheAssignationCoreRepository
    {
        Task<bool> AjouterTacheAssignationCoreAsync(TacheAssignationCore tacheAssignationCore);
        Task<bool> ModifierTacheAssignationCoreAsync(TacheAssignationCore tacheAssignationCore);
        Task<bool> SupprimerTacheAssignationCoreAsync(string id);
        Task<bool> SupprimerTacheAssignationCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<TacheAssignationCore> ObtenirTacheAssignationCoreParIdAsync(string id);
        Task<List<TacheAssignationCore>> ListeTacheAssignationCoreAsync();
        Task<List<TacheAssignationCore>> ListeTacheAssignationCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}