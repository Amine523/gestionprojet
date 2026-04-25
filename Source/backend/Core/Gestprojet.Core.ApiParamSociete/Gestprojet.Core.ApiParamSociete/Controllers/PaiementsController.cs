using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/paiements")]
    public class PaiementsController : ControllerBase
    {
        private readonly IPaiementCoreBusiness _bus;
        public PaiementsController(IPaiementCoreBusiness bus) => _bus = bus;

        [HttpPost] public Task<bool> Post(PaiementCore entity) => _bus.AjouterPaiementCoreAsync(entity);
        [HttpPut] public Task<bool> Put(PaiementCore entity) => _bus.ModifierPaiementCoreAsync(entity);
        [HttpDelete("{id}")] public Task<bool> Delete(string id) => _bus.SupprimerPaiementCoreAsync(id);
        [HttpGet("{id}")] public Task<PaiementCore> Get(string id) => _bus.ObtenirPaiementCoreParIdAsync(id);
        [HttpGet] public Task<List<PaiementCore>> GetAll() => _bus.ListePaiementCoreAsync();
        
        [HttpPost("search")]
        public Task<List<PaiementCore>> Search(CritereRecherche critere) => _bus.ListePaiementCoreParConditionAsync(critere);

        [HttpGet("paged")]
        public Task<ResultatPage<PaiementCore>> GetPaged(int page = 1, int size = 10) => _bus.ListePaiementCoreParPageAsync(page, size);
    }
}
