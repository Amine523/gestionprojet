using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe
{
    public class DemandeCongeRepository : IDemandeCongeRepository
    {
        private readonly IDemandeCongeApi _api;

        public DemandeCongeRepository(IDemandeCongeApi api)
        {
            _api = api;
        }

        public async Task<bool> AjouterAsync(DemandeCongeCore entity) => await _api.DemandeCongeAjouterPostAsync(entity);
        public async Task<bool> ModifierAsync(DemandeCongeCore entity) => await _api.DemandeCongeModifierPutAsync(entity);
        public async Task<DemandeCongeCore> ObtenirAsync(string id) => await _api.DemandeCongeObtenirIdIdGetAsync(id);
        public async Task<List<DemandeCongeCore>> ListeAsync() => await _api.DemandeCongeListeGetAsync();
        public async Task<List<DemandeCongeCore>> ListeParUtilisateurAsync(string utilisateurId) => await _api.DemandeCongeListeParUtilisateurIdUtilisateurIdGetAsync(utilisateurId);
        public async Task<List<DemandeCongeCore>> ListeParSocieteAsync(string societeId) => await _api.DemandeCongeListeParSocieteIdSocieteIdGetAsync(societeId);
        public async Task<bool> SupprimerAsync(string id) => await _api.DemandeCongeSupprimerIdIdDeleteAsync(id);
    }
}
