using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface ITypeCoreBusiness
    {
        Task<bool> AjouterTypeAsync(TypeCore typeCore);
        Task<bool> ModifierTypeAsync(TypeCore typeCore);
        Task<bool> SupprimerTypeAsync(string id);
        Task<bool> SupprimerTypeParConditionAsync(CritereRecherche critereRecherche);
        Task<TypeCore> ObtenirTypeParIdAsync(string id);
        Task<List<TypeCore>> ListeTypeAsync();
        Task<List<TypeCore>> ListeTypeParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<TypeCore>> ListeTypeParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<TypeCore>> ListeTypeParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}