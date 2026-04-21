$entities = @("Paiement", "DemandeConge", "ChatRoom", "ChatRoomMember", "ChatMessage", "Notification", "Contact", "BlockedIP", "DemandeLog")
$domainPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Domaine"
$infraPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Infrastructure"
$appPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete.Application"
$webPath = "c:\projet pfe\Source\backend\Core\Gestprojet.Core.ApiParamSociete\Gestprojet.Core.ApiParamSociete"

foreach ($name in $entities) {
    $coreName = $name + "Core"
    
    # 1. Repository Interface
    $repoIntContent = @"
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Repository
{
    public interface I$($coreName)Repository
    {
        Task<bool> Ajouter$($coreName)Async($coreName $coreName);
        Task<bool> Modifier$($coreName)Async($coreName $coreName);
        Task<bool> Supprimer$($coreName)Async(string id);
        Task<bool> Supprimer$($coreName)ParConditionAsync(CritereRecherche critereRecherche);
        Task<$coreName> Obtenir$($coreName)ParIdAsync(string id);
        Task<List<$coreName>> Liste$($coreName)Async();
        Task<List<$coreName>> Liste$($coreName)ParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<$coreName>> Liste$($coreName)ParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<$coreName>> Liste$($coreName)ParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
"@
    Set-Content -Path "$domainPath\Interfaces\Repository\I$($coreName)Repository.cs" -Value $repoIntContent

    # 2. Business Interface
    $busIntContent = @"
using Gestprojet.Core.ApiParamSociete.Domain.Models;
using Gestprojet.Core.ApiParamSociete.Domain.Models.Commun;

namespace Gestprojet.Core.ApiParamSociete.Domain.Interfaces.Business
{
    public interface I$($coreName)Business
    {
        Task<bool> Ajouter$($coreName)Async($coreName $coreName);
        Task<bool> Modifier$($coreName)Async($coreName $coreName);
        Task<bool> Supprimer$($coreName)Async(string id);
        Task<bool> Supprimer$($coreName)ParConditionAsync(CritereRecherche critereRecherche);
        Task<$coreName> Obtenir$($coreName)ParIdAsync(string id);
        Task<List<$coreName>> Liste$($coreName)Async();
        Task<List<$coreName>> Liste$($coreName)ParConditionAsync(CritereRecherche critereRecherche);
        Task<ResultatPage<$coreName>> Liste$($coreName)ParPageAsync(int pageNumero, int pageTaille);
        Task<ResultatPage<$coreName>> Liste$($coreName)ParConditionParPageAsync(CritereRecherche critereRecherche, int pageNumero, int pageTaille);
    }
}
"@
    Set-Content -Path "$domainPath\Interfaces\Business\I$($coreName)Business.cs" -Value $busIntContent

    # 3. Mapper (Placeholder - will be refined if needed, but usually just Dapper parameters)
    # Actually, Mappers in this project seem to use DynamicParameters.
    # Ex: SocieteCoreMapper.GetParameters(SocieteCore)
}
