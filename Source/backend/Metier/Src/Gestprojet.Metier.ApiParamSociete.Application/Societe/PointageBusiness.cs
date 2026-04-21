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
    public class PointageBusiness : IPointageBusiness
    {
        private readonly IPointageRepository _repository;

        public PointageBusiness(IPointageRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(PointageCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<PointageCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<PointageCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<PointageCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<IEnumerable<PointageDetailles>> ListeDetailleAsync() => _repository.ListeDetailleAsync();
        public Task<IEnumerable<PointageDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere) => _repository.ListeDetailleParConditionAsync(critere);
        public Task<ResultatPage<PointageCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<PointageCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<ResultatPage<PointageDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille) => _repository.ListeDetailleParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<PointageDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeDetailleParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
