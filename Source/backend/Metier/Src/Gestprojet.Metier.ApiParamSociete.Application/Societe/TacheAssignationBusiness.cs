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
    public class TacheAssignationBusiness : ITacheAssignationBusiness
    {
        private readonly ITacheAssignationRepository _repository;

        public TacheAssignationBusiness(ITacheAssignationRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(TacheAssignationCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<TacheAssignationCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<TacheAssignationCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<TacheAssignationCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleAsync() => _repository.ListeDetailleAsync();
        public Task<IEnumerable<TacheAssignationDetailles>> ListeDetailleParConditionAsync(ConditionRecherche critere) => _repository.ListeDetailleParConditionAsync(critere);
        public Task<ResultatPage<TacheAssignationCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<TacheAssignationCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
        public Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParPageAsync(int pageNumero, int pageTaille) => _repository.ListeDetailleParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<TacheAssignationDetailles>> ListeDetailleParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeDetailleParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
