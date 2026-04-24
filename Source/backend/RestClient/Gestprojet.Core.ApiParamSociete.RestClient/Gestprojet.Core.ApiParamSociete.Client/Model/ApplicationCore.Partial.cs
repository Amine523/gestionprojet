using System;
using System.Runtime.Serialization;

namespace Gestprojet.Core.ApiParamSociete.Client.Model
{
    public partial class ApplicationCore
    {
        [DataMember(Name = "societeId", EmitDefaultValue = true)]
        public string SocieteId { get; set; }

        [DataMember(Name = "offreId", EmitDefaultValue = true)]
        public string OffreId { get; set; }

        [DataMember(Name = "titre", EmitDefaultValue = true)]
        public string Titre { get; set; }

        [DataMember(Name = "description", EmitDefaultValue = true)]
        public string Description { get; set; }
    }
}
