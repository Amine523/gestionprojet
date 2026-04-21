using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ITacheAssignationCoreBusiness
    {
        Task<bool> AjouterTacheAssignationAsync(TacheAssignationCore tacheAssignationCore);
        Task<bool> ModifierTacheAssignationAsync(TacheAssignationCore tacheAssignationCore);
        Task<bool> SupprimerTacheAssignationAsync(string id);
        Task<bool> SupprimerTacheAssignationParConditionAsync(CritereRecherche critereRecherche);
        Task<TacheAssignationCore> ObtenirTacheAssignationParIdAsync(string id);
        Task<List<TacheAssignationCore>> ListeTacheAssignationAsync();
        Task<List<TacheAssignationCore>> ListeTacheAssignationParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TacheAssignationCore>> ListeTacheAssignationParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}