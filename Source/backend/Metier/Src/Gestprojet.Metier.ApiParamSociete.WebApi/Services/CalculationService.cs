using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gestprojet.Core.ApiParamSociete.Client.Model;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Societe.Business;
using Gestprojet.Metier.ApiParamSociete.WebApi.Models.DTOs;
using Gestprojet.Metier.ApiParamSociete.Domain.Interfaces.Commun;

namespace Gestprojet.Metier.ApiParamSociete.WebApi.Services
{
    public class CalculationService
    {
        private readonly IProjetBusiness _projetBusiness;
        private readonly ITacheBusiness _tacheBusiness;

        public CalculationService(IProjetBusiness projetBusiness, ITacheBusiness tacheBusiness)
        {
            _projetBusiness = projetBusiness;
            _tacheBusiness = tacheBusiness;
        }

        public async Task<ProjectStatsDTO> CalculateProjectStatsAsync(string projectId)
        {
            var projet = await _projetBusiness.ObtenirAsync(projectId);
            if (projet == null)
                throw new KeyNotFoundException($"Project {projectId} not found");

            var allTaches = await _tacheBusiness.ListeAsync();
            var taches = allTaches.Where(t => t.ProjetId == projectId && t.Actif == true).ToList();

            int totalTaches = taches.Count;
            int tachesDone = taches.Count(t => t.Statut == "Done" || t.Statut == "Terminé" || t.Statut == "done");
            int tachesInProgress = taches.Count(t => t.Statut == "In Progress" || t.Statut == "En cours" || t.Statut == "inprogress");
            int tachesTodo = taches.Count(t => t.Statut == "To Do" || t.Statut == "À faire" || t.Statut == "todo");

            double pourcentageAvancement = totalTaches > 0 ? (double)tachesDone / totalTaches * 100 : 0;
            
            bool estEnRetard = false;
            if (projet.EndDate.HasValue && projet.EndDate.Value < DateTime.Now && tachesDone < totalTaches)
            {
                estEnRetard = true;
            }

            return new ProjectStatsDTO
            {
                ProjectId = projectId,
                ProjectNom = projet.Nom,
                TotalTaches = totalTaches,
                TachesDone = tachesDone,
                TachesInProgress = tachesInProgress,
                TachesToDo = tachesTodo,
                PourcentageAvancement = pourcentageAvancement,
                EstEnRetard = estEnRetard,
                TotalTempsEstime = (decimal)taches.Sum(t => t.TempsEstime ?? 0),
                TotalTempsReel = (decimal)taches.Sum(t => t.TempsReel ?? 0)
            };
        }

        public async Task<List<ProjectStatsDTO>> CalculateAllProjectsStatsAsync(string societeId)
        {
            var projets = await _projetBusiness.ListeParSocieteAsync(societeId);
            var statsList = new List<ProjectStatsDTO>();

            foreach (var projet in projets)
            {
                statsList.Add(await CalculateProjectStatsAsync(projet.Id));
            }

            return statsList;
        }

        public async Task AutoUpdateProjectStatusAsync(string projectId)
        {
            var stats = await CalculateProjectStatsAsync(projectId);
            var projet = await _projetBusiness.ObtenirAsync(projectId);

            if (stats.TotalTaches > 0 && stats.TachesDone == stats.TotalTaches)
            {
                if (projet.Status != "Done" && projet.Status != "Terminé")
                {
                    projet.Status = "Terminé";
                    await _projetBusiness.AjouterOuModifierAsync(projet);
                }
            }
            else if (stats.TachesInProgress > 0 || stats.TachesDone > 0)
            {
                if (projet.Status == "To Do" || projet.Status == "À faire")
                {
                    projet.Status = "En cours";
                    await _projetBusiness.AjouterOuModifierAsync(projet);
                }
            }
        }
    }
}
