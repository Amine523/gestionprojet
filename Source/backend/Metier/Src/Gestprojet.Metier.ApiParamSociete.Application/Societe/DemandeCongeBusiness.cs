using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Application.Societe
{
    public class DemandeCongeBusiness : IDemandeCongeBusiness
    {
        private readonly IDemandeCongeRepository _repository;

        public DemandeCongeBusiness(IDemandeCongeRepository repository)
        {
            _repository = repository;
        }

        public async Task<OperationResult> AjouterOuModifierAsync(DemandeCongeCore entity)
        {
            bool success;
            if (string.IsNullOrEmpty(entity.Id))
            {
                entity.Id = "CNG_" + System.Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
                success = await _repository.AjouterAsync(entity);
            }
            else
            {
                success = await _repository.ModifierAsync(entity);
            }
            return new OperationResult { Success = success };
        }

        public async Task<DemandeCongeCore> ObtenirAsync(string id) => await _repository.ObtenirAsync(id);
        public async Task<IEnumerable<DemandeCongeCore>> ListeAsync() => await _repository.ListeAsync();
        public async Task<IEnumerable<DemandeCongeCore>> ListeParUtilisateurAsync(string utilisateurId) => await _repository.ListeParUtilisateurAsync(utilisateurId);
        public async Task<IEnumerable<DemandeCongeCore>> ListeParSocieteAsync(string societeId) => await _repository.ListeParSocieteAsync(societeId);
        public async Task<OperationResult> SupprimerAsync(string id) => new OperationResult { Success = await _repository.SupprimerAsync(id) };
    }
}
