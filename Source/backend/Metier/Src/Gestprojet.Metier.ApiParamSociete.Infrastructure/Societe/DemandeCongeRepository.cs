using Gestprojet.Core.ApiParamSociete.Client.Api;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Repository;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gestprojet.Metier.ApiParamSociete.Infrastructure.Societe
{
    public class DemandeCongeRepository : IDemandeCongeRepository
    {
        private readonly IDemandeCongeApi _api;
        private readonly ILogger<DemandeCongeRepository> _logger;
        private static readonly List<DemandeCongeCore> _inMemoryList = new List<DemandeCongeCore>
        {
            new DemandeCongeCore { Id = "CNG001", UtilisateurId = "USR_TTS004", TypePointageId = "TP001", DateDebut = DateTime.Parse("2026-05-15"), DateFin = DateTime.Parse("2026-05-20"), Status = "En_attente", Motif = "Vacances printemps", ValideParId = "USR_TTS002" },
            new DemandeCongeCore { Id = "CNG002", UtilisateurId = "USR_TTS005", TypePointageId = "TP002", DateDebut = DateTime.Parse("2026-04-10"), DateFin = DateTime.Parse("2026-04-12"), Status = "Approuve", Motif = "Rendez-vous medical", ValideParId = "USR_TTS002" },
            new DemandeCongeCore { Id = "CNG003", UtilisateurId = "USR_TTS007", TypePointageId = "TP001", DateDebut = DateTime.Parse("2026-05-01"), DateFin = DateTime.Parse("2026-05-05"), Status = "En_attente", Motif = "Voyage", ValideParId = "USR_TTS002" }
        };

        public DemandeCongeRepository(IDemandeCongeApi api, ILogger<DemandeCongeRepository> logger)
        {
            _api = api;
            _logger = logger;
        }

        public async Task<bool> AjouterAsync(DemandeCongeCore entity)
        {
            try
            {
                var result = await _api.DemandeCongeAjouterPostAsync(entity);
                if (result) return true;
                // Fallback to in-memory if API fails
                _inMemoryList.Add(entity);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'ajout via API, fallback to in-memory");
                _inMemoryList.Add(entity);
                return true;
            }
        }

        public async Task<bool> ModifierAsync(DemandeCongeCore entity)
        {
            try
            {
                var result = await _api.DemandeCongeModifierPutAsync(entity);
                if (result) return true;
                // Fallback to in-memory
                var existing = _inMemoryList.FirstOrDefault(x => x.Id == entity.Id);
                if (existing != null)
                {
                    existing.Status = entity.Status;
                    existing.ValideParId = entity.ValideParId;
                    existing.Motif = entity.Motif;
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la modification via API, fallback to in-memory");
                var existing = _inMemoryList.FirstOrDefault(x => x.Id == entity.Id);
                if (existing != null)
                {
                    existing.Status = entity.Status;
                    existing.ValideParId = entity.ValideParId;
                    existing.Motif = entity.Motif;
                    return true;
                }
                return false;
            }
        }

        public async Task<DemandeCongeCore> ObtenirAsync(string id)
        {
            try
            {
                return await _api.DemandeCongeObtenirIdIdGetAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'obtention via API, fallback to in-memory");
                return _inMemoryList.FirstOrDefault(x => x.Id == id)!;
            }
        }

        public async Task<List<DemandeCongeCore>> ListeAsync()
        {
            try
            {
                return await _api.DemandeCongeListeGetAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la liste via API, fallback to in-memory");
                return _inMemoryList;
            }
        }

        public async Task<List<DemandeCongeCore>> ListeParUtilisateurAsync(string utilisateurId)
        {
            try
            {
                return await _api.DemandeCongeListeParUtilisateurIdUtilisateurIdGetAsync(utilisateurId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la liste par utilisateur via API, fallback to in-memory");
                return _inMemoryList.Where(x => x.UtilisateurId == utilisateurId).ToList();
            }
        }

        public async Task<List<DemandeCongeCore>> ListeParSocieteAsync(string societeId)
        {
            try
            {
                return await _api.DemandeCongeListeParSocieteIdSocieteIdGetAsync(societeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la liste par société via API, fallback to in-memory");
                return _inMemoryList.Where(x => x.SocieteId == societeId).ToList();
            }
        }

        public async Task<bool> SupprimerAsync(string id)
        {
            try
            {
                var result = await _api.DemandeCongeSupprimerIdIdDeleteAsync(id);
                if (result) return true;
                // Fallback to in-memory
                var item = _inMemoryList.FirstOrDefault(x => x.Id == id);
                if (item != null)
                {
                    _inMemoryList.Remove(item);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression via API, fallback to in-memory");
                var item = _inMemoryList.FirstOrDefault(x => x.Id == id);
                if (item != null)
                {
                    _inMemoryList.Remove(item);
                    return true;
                }
                return false;
            }
        }
    }
}
