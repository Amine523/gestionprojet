using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ISocieteCoreBusiness
    {
        Task<bool> AjouterSocieteAsync(SocieteCore societeCore);
        Task<bool> ModifierSocieteAsync(SocieteCore societeCore);
        Task<bool> SupprimerSocieteAsync(string id);
        Task<bool> SupprimerSocieteParConditionAsync(CritereRecherche critereRecherche);
        Task<SocieteCore> ObtenirSocieteParIdAsync(string id);
        Task<List<SocieteCore>> ListeSocieteAsync();
        Task<List<SocieteCore>> ListeSocieteParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<SocieteCore>> ListeSocieteParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<SocieteCore>> ListeSocieteParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}