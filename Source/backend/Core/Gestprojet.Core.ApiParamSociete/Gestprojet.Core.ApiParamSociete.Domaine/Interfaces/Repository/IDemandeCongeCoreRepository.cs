using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface IDemandeCongeCoreRepository
    {
        Task<bool> AjouterDemandeCongeCoreAsync(DemandeCongeCore demandeCongeCore);
        Task<bool> ModifierDemandeCongeCoreAsync(DemandeCongeCore demandeCongeCore);
        Task<bool> SupprimerDemandeCongeCoreAsync(string id);
        Task<bool> SupprimerDemandeCongeCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<DemandeCongeCore> ObtenirDemandeCongeCoreParIdAsync(string id);
        Task<List<DemandeCongeCore>> ListeDemandeCongeCoreAsync();
        Task<List<DemandeCongeCore>> ListeDemandeCongeCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }

    public interface IJourFerieCoreRepository
    {
        Task<bool> AjouterJourFerieCoreAsync(JourFerieCore jourFerieCore);
        Task<bool> ModifierJourFerieCoreAsync(JourFerieCore jourFerieCore);
        Task<bool> SupprimerJourFerieCoreAsync(string id);
        Task<bool> SupprimerJourFerieCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<JourFerieCore> ObtenirJourFerieCoreParIdAsync(string id);
        Task<List<JourFerieCore>> ListeJourFerieCoreAsync();
        Task<List<JourFerieCore>> ListeJourFerieCoreParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<JourFerieCore>> ListeJourFerieCoreParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<JourFerieCore>> ListeJourFerieCoreParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
