using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class ProjetCoreBusiness : IProjetCoreBusiness
    {
        private readonly IProjetCoreRepository _repository;

        public ProjetCoreBusiness(IProjetCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterProjetAsync(ProjetCore entity)
            => await _repository.AjouterProjetCoreAsync(entity);

        public async Task<bool> ModifierProjetAsync(ProjetCore entity)
            => await _repository.ModifierProjetCoreAsync(entity);

        public async Task<bool> SupprimerProjetAsync(string id)
            => await _repository.SupprimerProjetCoreAsync(id);

        public async Task<bool> SupprimerProjetParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerProjetCoreParConditionAsync(critere);

        public async Task<ProjetCore> ObtenirProjetParIdAsync(string id)
            => await _repository.ObtenirProjetCoreParIdAsync(id);

        public async Task<List<ProjetCore>> ListeProjetAsync()
            => await _repository.ListeProjetCoreAsync();

        public async Task<List<ProjetCore>> ListeProjetParConditionAsync(CritereRecherche critere)
            => await _repository.ListeProjetCoreParConditionAsync(critere);

        public async Task<ResultatPage<ProjetCore>> ListeProjetParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeProjetCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<ProjetCore>> ListeProjetParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeProjetCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}