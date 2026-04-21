using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IPointageCoreBusiness
    {
        Task<bool> AjouterPointageAsync(PointageCore pointageCore);
        Task<bool> ModifierPointageAsync(PointageCore pointageCore);
        Task<bool> SupprimerPointageAsync(string id);
        Task<bool> SupprimerPointageParConditionAsync(CritereRecherche critereRecherche);
        Task<PointageCore> ObtenirPointageParIdAsync(string id);
        Task<List<PointageCore>> ListePointageAsync();
        Task<List<PointageCore>> ListePointageParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<PointageCore>> ListePointageParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<PointageCore>> ListePointageParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}