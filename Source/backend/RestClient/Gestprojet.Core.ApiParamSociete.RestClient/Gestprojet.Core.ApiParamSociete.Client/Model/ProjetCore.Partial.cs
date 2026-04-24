using System.Runtime.Serialization;

namespace Gestprojet.Core.ApiParamSociete.Client.Model
{
    public partial class ProjetCore
    {
        [DataMember(Name = "societeId", EmitDefaultValue = false)]
        public string SocieteId { get; set; }
    }
}
