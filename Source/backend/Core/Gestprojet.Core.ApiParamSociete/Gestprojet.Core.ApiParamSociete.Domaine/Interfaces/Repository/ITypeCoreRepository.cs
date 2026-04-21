using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface ITypeCoreRepository
    {
        Task<bool> AjouterTypeCoreAsync(TypeCore typeCore);
        Task<bool> ModifierTypeCoreAsync(TypeCore typeCore);
        Task<bool> SupprimerTypeCoreAsync(string id);
        Task<bool> SupprimerTypeCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<TypeCore> ObtenirTypeCoreParIdAsync(string id);
        Task<List<TypeCore>> ListeTypeCoreAsync();
        Task<List<TypeCore>> ListeTypeCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TypeCore>> ListeTypeCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeCore>> ListeTypeCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}