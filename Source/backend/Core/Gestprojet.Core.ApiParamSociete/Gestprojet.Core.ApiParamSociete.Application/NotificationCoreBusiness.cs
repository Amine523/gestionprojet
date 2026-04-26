using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class NotificationCoreBusiness : INotificationCoreBusiness
    {
        private readonly INotificationCoreRepository _repository;

        public NotificationCoreBusiness(INotificationCoreRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AjouterNotificationCoreAsync(NotificationCore entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
            {
                entity.Id = $"N{DateTime.Now:yyyyMMddHHmmssfff}";
            }
            if (entity.DateCreation == null)
            {
                entity.DateCreation = DateTime.Now;
            }
            return await _repository.AjouterNotificationCoreAsync(entity);
        }

        public async Task<bool> ModifierNotificationCoreAsync(NotificationCore entity)
            => await _repository.ModifierNotificationCoreAsync(entity);

        public async Task<bool> SupprimerNotificationCoreAsync(string id)
            => await _repository.SupprimerNotificationCoreAsync(id);

        public async Task<NotificationCore> ObtenirNotificationCoreParIdAsync(string id)
            => await _repository.ObtenirNotificationCoreParIdAsync(id);

        public async Task<List<NotificationCore>> ListeNotificationCoreAsync()
            => await _repository.ListeNotificationCoreAsync();

        public async Task<List<NotificationCore>> ListeNotificationCoreParConditionAsync(CritereRecherche critere)
            => await _repository.ListeNotificationCoreParConditionAsync(critere);
    }
}
