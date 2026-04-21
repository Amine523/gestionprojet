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
    public class SocieteBusiness : ISocieteBusiness
    {
        private readonly ISocieteRepository _repository;

        public SocieteBusiness(ISocieteRepository repository) => _repository = repository;

        public Task<OperationResult> AjouterOuModifierAsync(SocieteCore entity) => _repository.AjouterOuModifierAsync(entity);
        public Task<SocieteCore> ObtenirAsync(string id) => _repository.ObtenirAsync(id);
        public Task<IEnumerable<SocieteCore>> ListeAsync() => _repository.ListeAsync();
        public Task<IEnumerable<SocieteCore>> ListeParCritereAsync(ConditionRecherche critere) => _repository.ListeParCritereAsync(critere);
        public Task<OperationResult> SupprimerAsync(string id) => _repository.SupprimerAsync(id);
        public Task<OperationResult> SupprimerParConditionAsync(ConditionRecherche critere) => _repository.SupprimerParConditionAsync(critere);
        public Task<ResultatPage<SocieteCore>> ListeParPageAsync(int pageNumero, int pageTaille) => _repository.ListeParPageAsync(pageNumero, pageTaille);
        public Task<ResultatPage<SocieteCore>> ListeParConditionParPageAsync(ConditionRecherche critere, int pageNumero, int pageTaille) => _repository.ListeParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}
