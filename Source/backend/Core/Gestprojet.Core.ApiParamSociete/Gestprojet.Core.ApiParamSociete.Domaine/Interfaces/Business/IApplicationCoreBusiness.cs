using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface IApplicationCoreBusiness
    {
        Task<bool> AjouterApplicationAsync(ApplicationCore applicationCore);
        Task<bool> ModifierApplicationAsync(ApplicationCore applicationCore);
        Task<bool> SupprimerApplicationAsync(string id);
        Task<bool> SupprimerApplicationParConditionAsync(CritereRecherche critereRecherche);
        Task<ApplicationCore> ObtenirApplicationParIdAsync(string id);
        Task<List<ApplicationCore>> ListeApplicationAsync();
        Task<List<ApplicationCore>> ListeApplicationParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<ApplicationCore>> ListeApplicationParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<ApplicationCore>> ListeApplicationParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}