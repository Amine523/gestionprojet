using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class AttachementCoreBusiness : IAttachementCoreBusiness
    {
        private readonly IAttachementCoreRepository _repository;

        public AttachementCoreBusiness(IAttachementCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterAttachementAsync(AttachementCore entity)
            => await _repository.AjouterAttachementCoreAsync(entity);

        public async Task<bool> ModifierAttachementAsync(AttachementCore entity)
            => await _repository.ModifierAttachementCoreAsync(entity);

        public async Task<bool> SupprimerAttachementAsync(string id)
            => await _repository.SupprimerAttachementCoreAsync(id);

        public async Task<bool> SupprimerAttachementParConditionAsync(CritereRecherche critere)
            => await _repository.SupprimerAttachementCoreParConditionAsync(critere);

        public async Task<AttachementCore> ObtenirAttachementParIdAsync(string id)
            => await _repository.ObtenirAttachementCoreParIdAsync(id);

        public async Task<List<AttachementCore>> ListeAttachementAsync()
            => await _repository.ListeAttachementCoreAsync();

        public async Task<List<AttachementCore>> ListeAttachementParConditionAsync(CritereRecherche critere)
            => await _repository.ListeAttachementCoreParConditionAsync(critere);

        public async Task<ResultatPage<AttachementCore>> ListeAttachementParPageAsync(int pageNumero, int pageTaille)
            => await _repository.ListeAttachementCoreParPageAsync(pageNumero, pageTaille);

        public async Task<ResultatPage<AttachementCore>> ListeAttachementParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
            => await _repository.ListeAttachementCoreParConditionParPageAsync(critere, pageNumero, pageTaille);
    }
}