# Configuration des entités et leurs propriétés
$entities = @(
    @{ Name="Abonnement"; Props=@("Id", "SocieteId", "TypeAbonnement", "DateDebut", "DateFin", "Actif") },
    @{ Name="Paiement"; Props=@("Id", "SocieteId", "SocieteNom", "Description", "Montant", "Date", "Statut", "Type") },
    @{ Name="DemandeConge"; Props=@("Id", "UtilisateurId", "TypePointageId", "DateDebut", "DateFin", "Status", "Motif", "ValideParId") },
    @{ Name="ChatRoom"; Props=@("Id", "Nom", "ProjetId", "Actif") },
    @{ Name="ChatRoomMember"; Props=@("Id", "ChatRoomId", "UtilisateurId") },
    @{ Name="ChatMessage"; Props=@("Id", "ChatRoomId", "ExpediteurId", "Message", "DateEnvoi", "EstLu") },
    @{ Name="Notification"; Props=@("Id", "UtilisateurId", "Titre", "Contenu", "EstLu", "DateCreation") },
    @{ Name="Contact"; Props=@("Id", "SocieteId", "Nom", "Email", "Telephone", "Actif") },
    @{ Name="BlockedIP"; Props=@("Id", "IPAddress", "Reason", "DateBlocked") },
    @{ Name="DemandeLog"; Props=@("Id", "UtilisateurId", "UtilisateurNom", "Action", "Description", "EntiteType", "EntiteId", "IpAddress", "DateCreation") }
)

$domainPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Domaine"
$infraPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Infrastructure"
$appPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Application"
$webPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete"

foreach ($e in $entities) {
    $name = $e.Name
    $coreName = $name + "Core"
    $props = $e.Props

    # --- 1. Infrastructure: Mapper ---
    $propList = $props | ForEach-Object { "                $coreName.$_" }
    $propListString = [string]::Join(",`n", $propList)
    
    $mapperContent = @"
using Gestprojet.Core.ApiParamSociete.Domain.Models;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public static class $($coreName)Mapper
    {
        public static object GetParameters($coreName $coreName)
        {
            return new
            {
$propListString
            };
        }
    }
}
"@
    Set-Content -Path "$infraPath\$($coreName)Mapper.cs" -Value $mapperContent

    # --- 2. Infrastructure: Repository ---
    $repoContent = @"
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Infrastructure.Dapper;
using Dapper;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;
using System.Data;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;

namespace Gestprojet.Core.ApiParamSociete.Infrastructure
{
    public class $($coreName)Repository : I$($coreName)Repository
    {
        private readonly DapperContext _context;
        public $($coreName)Repository(DapperContext context) => _context = context;

        public async Task<bool> Ajouter$($coreName)Async($coreName entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_$($name)_i, $($coreName)Mapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> Modifier$($coreName)Async($coreName entity)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_$($name)_u, $($coreName)Mapper.GetParameters(entity), commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> Supprimer$($coreName)Async(string id)
        {
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_$($name)_d, new { id }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<bool> Supprimer$($coreName)ParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var response = await connection.QueryFirstOrDefaultAsync<int>(Constants.Ps_$($name)_d_ParCondition, new { CritereRecherche = condition }, commandType: CommandType.StoredProcedure);
            return response > 0;
        }

        public async Task<$coreName> Obtenir$($coreName)ParIdAsync(string id)
        {
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<$coreName>(Constants.Ps_$($name)_s_ParId, new { id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<$coreName>> Liste$($coreName)Async()
        {
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<$coreName>(Constants.Ps_$($name)_s_Liste, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<List<$coreName>> Liste$($coreName)ParConditionAsync(CritereRecherche critere)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<$coreName>(Constants.Ps_$($name)_s_Liste_ParCondition, new { condition }, commandType: CommandType.StoredProcedure);
            return result.AsList();
        }

        public async Task<ResultatPage<$coreName>> Liste$($coreName)ParPageAsync(int pageNumero, int pageTaille)
        {
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_$($name)_s_Liste_Page, new { PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<$coreName>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<$coreName> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }

        public async Task<ResultatPage<$coreName>> Liste$($coreName)ParConditionParPageAsync(CritereRecherche critere, int pageNumero, int pageTaille)
        {
            string condition = SoftProExtensions.ToSqlCondition(critere);
            using var connection = _context.CreateConnection();
            using var multi = await connection.QueryMultipleAsync(Constants.Ps_$($name)_s_Liste_ParCondition_Page, new { Condition = condition, PageNumero = pageNumero, PageTaille = pageTaille }, commandType: CommandType.StoredProcedure);
            var data = (await multi.ReadAsync<$coreName>()).AsList();
            var totalCount = await multi.ReadFirstOrDefaultAsync<int>();
            return new ResultatPage<$coreName> { Items = data, TotalCount = totalCount, PageNumber = pageNumero, PageSize = pageTaille };
        }
    }
}
"@
    Set-Content -Path "$infraPath\$($coreName)Repository.cs" -Value $repoContent

    # --- 3. Application: Business Service ---
    $busContent = @"
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Application
{
    public class $($coreName)Business : I$($coreName)Business
    {
        private readonly I$($coreName)Repository _repo;
        public $($coreName)Business(I$($coreName)Repository repo) => _repo = repo;

        public Task<bool> Ajouter$($coreName)Async($coreName entity) => _repo.Ajouter$($coreName)Async(entity);
        public Task<bool> Modifier$($coreName)Async($coreName entity) => _repo.Modifier$($coreName)Async(entity);
        public Task<bool> Supprimer$($coreName)Async(string id) => _repo.Supprimer$($coreName)Async(id);
        public Task<bool> Supprimer$($coreName)ParConditionAsync(CritereRecherche critere) => _repo.Supprimer$($coreName)ParConditionAsync(critere);
        public Task<$coreName> Obtenir$($coreName)ParIdAsync(string id) => _repo.Obtenir$($coreName)ParIdAsync(id);
        public Task<List<$coreName>> Liste$($coreName)Async() => _repo.Liste$($coreName)Async();
        public Task<List<$coreName>> Liste$($coreName)ParConditionAsync(CritereRecherche critere) => _repo.Liste$($coreName)ParConditionAsync(critere);
        public Task<ResultatPage<$coreName>> Liste$($coreName)ParPageAsync(int num, int size) => _repo.Liste$($coreName)ParPageAsync(num, size);
        public Task<ResultatPage<$coreName>> Liste$($coreName)ParConditionParPageAsync(CritereRecherche critere, int num, int size) => _repo.Liste$($coreName)ParConditionParPageAsync(critere, num, size);
    }
}
"@
    Set-Content -Path "$appPath\$($coreName)Business.cs" -Value $busContent

    # --- 4. WebAPI: Controller ---
    $ctrlContent = @"
using Microsoft.AspNetCore.Mvc;
using Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business;
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class $($name)sController : ControllerBase
    {
        private readonly I$($coreName)Business _bus;
        public $($name)sController(I$($coreName)Business bus) => _bus = bus;

        [HttpPost] public Task<bool> Post($coreName entity) => _bus.Ajouter$($coreName)Async(entity);
        [HttpPut] public Task<bool> Put($coreName entity) => _bus.Modifier$($coreName)Async(entity);
        [HttpDelete("{id}")] public Task<bool> Delete(string id) => _bus.Supprimer$($coreName)Async(id);
        [HttpGet("{id}")] public Task<$coreName> Get(string id) => _bus.Obtenir$($coreName)ParIdAsync(id);
        [HttpGet] public Task<List<$coreName>> GetAll() => _bus.Liste$($coreName)Async();
        
        [HttpPost("search")]
        public Task<List<$coreName>> Search(CritereRecherche critere) => _bus.Liste$($coreName)ParConditionAsync(critere);

        [HttpGet("paged")]
        public Task<ResultatPage<$coreName>> GetPaged(int page = 1, int size = 10) => _bus.Liste$($coreName)ParPageAsync(page, size);
    }
}
"@
    Set-Content -Path "$webPath\Controllers\$($name)sController.cs" -Value $ctrlContent
}
