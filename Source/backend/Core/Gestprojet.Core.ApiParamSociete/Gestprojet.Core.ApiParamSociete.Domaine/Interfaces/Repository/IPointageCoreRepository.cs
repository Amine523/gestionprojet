using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IPointageCoreRepository
    {
        Task<bool> AjouterPointageCoreAsync(PointageCore pointageCore);
        Task<bool> ModifierPointageCoreAsync(PointageCore pointageCore);
        Task<bool> SupprimerPointageCoreAsync(string id);
        Task<bool> SupprimerPointageCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<PointageCore> ObtenirPointageCoreParIdAsync(string id);
        Task<List<PointageCore>> ListePointageCoreAsync();
        Task<List<PointageCore>> ListePointageCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<PointageCore>> ListePointageCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PointageCore>> ListePointageCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}