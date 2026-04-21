using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/abonnements")]
    public class AbonnementsController : ControllerBase
    {
        private readonly IAbonnementCoreBusiness _bus;
        public AbonnementsController(IAbonnementCoreBusiness bus) => _bus = bus;

        [HttpPost] public Task<bool> Post(AbonnementCore entity) => _bus.AjouterAbonnementCoreAsync(entity);
        [HttpPut] public Task<bool> Put(AbonnementCore entity) => _bus.ModifierAbonnementCoreAsync(entity);
        [HttpDelete("{id}")] public Task<bool> Delete(string id) => _bus.SupprimerAbonnementCoreAsync(id);
        [HttpGet("{id}")] public Task<AbonnementCore> Get(string id) => _bus.ObtenirAbonnementCoreParIdAsync(id);
        [HttpGet] public Task<List<AbonnementCore>> GetAll() => _bus.ListeAbonnementCoreAsync();
        
        [HttpPost("search")]
        public Task<List<AbonnementCore>> Search(CritereRecherche critere) => _bus.ListeAbonnementCoreParConditionAsync(critere);

        [HttpGet("paged")]
        public Task<ResultatPage<AbonnementCore>> GetPaged(int page = 1, int size = 10) => _bus.ListeAbonnementCoreParPageAsync(page, size);
    }
}
