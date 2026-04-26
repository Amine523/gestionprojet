using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class DemandeCongeCoreBusiness : IDemandeCongeCoreBusiness
    {
        private readonly IDemandeCongeCoreRepository _repository;

        public DemandeCongeCoreBusiness(IDemandeCongeCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterDemandeCongeAsync(DemandeCongeCore entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
            {
                entity.Id = $"CNG_{Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()}";
            }
            return await _repository.AjouterDemandeCongeCoreAsync(entity);
        }

        public async Task<bool> ModifierDemandeCongeAsync(DemandeCongeCore entity)
            => await _repository.ModifierDemandeCongeCoreAsync(entity);

        public async Task<bool> SupprimerDemandeCongeAsync(string id)
            => await _repository.SupprimerDemandeCongeCoreAsync(id);

        public async Task<bool> SupprimerDemandeCongeParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerDemandeCongeCoreParConditionAsync(critere);

        public async Task<DemandeCongeCore> ObtenirDemandeCongeParIdAsync(string id)
            => await _repository.ObtenirDemandeCongeCoreParIdAsync(id);

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeAsync()
            => await _repository.ListeDemandeCongeCoreAsync();

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeParConditionAsync(CritereRecherche critere)
            => await _repository.ListeDemandeCongeCoreParConditionAsync(critere);

        public async Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeDemandeCongeCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<DemandeCongeCore>> ListeDemandeCongeParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeDemandeCongeCoreParConditionParPageAsync(critere, pageNumero, pageTaille);

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeParSocieteAsync(string societeId)
        {
            var critere = new CritereRecherche { SocieteId = societeId };
            return await _repository.ListeDemandeCongeCoreParConditionAsync(critere);
        }

        public async Task<List<DemandeCongeCore>> ListeDemandeCongeParUtilisateurAsync(string utilisateurId)
        {
            var critere = new CritereRecherche { UtilisateurId = utilisateurId };
            return await _repository.ListeDemandeCongeCoreParConditionAsync(critere);
        }
    }

    public class JourFerieCoreBusiness : IJourFerieCoreBusiness
    {
        private readonly IJourFerieCoreRepository _repository;

        public JourFerieCoreBusiness(IJourFerieCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterJourFerieAsync(JourFerieCore entity)
            => await _repository.AjouterJourFerieCoreAsync(entity);

        public async Task<bool> ModifierJourFerieAsync(JourFerieCore entity)
            => await _repository.ModifierJourFerieCoreAsync(entity);

        public async Task<bool> SupprimerJourFerieAsync(string id)
            => await _repository.SupprimerJourFerieCoreAsync(id);

        public async Task<bool> SupprimerJourFerieParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerJourFerieCoreParConditionAsync(critere);

        public async Task<JourFerieCore> ObtenirJourFerieParIdAsync(string id)
            => await _repository.ObtenirJourFerieCoreParIdAsync(id);

        public async Task<List<JourFerieCore>> ListeJourFerieAsync()
            => await _repository.ListeJourFerieCoreAsync();

        public async Task<List<JourFerieCore>> ListeJourFerieParConditionAsync(CritereRecherche critere)
            => await _repository.ListeJourFerieCoreParConditionAsync(critere);

        public async Task<ResultatPage<JourFerieCore>> ListeJourFerieParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeJourFerieCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<JourFerieCore>> ListeJourFerieParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeJourFerieCoreParConditionParPageAsync(critere, pageNumero, pageTaille);

        public async Task<List<JourFerieCore>> ListeJourFerieParSocieteAsync(string societeId)
        {
            var critere = new CritereRecherche { SocieteId = societeId };
            return await _repository.ListeJourFerieCoreParConditionAsync(critere);
        }
    }
}
