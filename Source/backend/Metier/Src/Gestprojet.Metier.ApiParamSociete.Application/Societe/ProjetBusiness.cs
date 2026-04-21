using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Societe;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Application.Societe
{
    public class ProjetBusiness : IProjetBusiness
    {
        private readonly IProjetRepository _repository;

        public ProjetBusiness(IProjetRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(ProjetCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<ProjetCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<ProjetCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<ProjetCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<IEnumerable<ProjetDetailles>> ListeDetailleAsync() => _repository.ListeDetailleAsync();
        public Task<IEnumerable<ProjetDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere) => _repository.ListeDetailleParConditionAsync(critere);
        public Task<ResultatPage<ProjetCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<ProjetCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<ResultatPage<ProjetDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille) => _repository.ListeDetailleParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<ProjetDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeDetailleParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<IEnumerable<ProjetCore>> ListeParSocieteAsync(string societeId) => _repository.ListeParSocieteAsync(societeId);
    }
}
