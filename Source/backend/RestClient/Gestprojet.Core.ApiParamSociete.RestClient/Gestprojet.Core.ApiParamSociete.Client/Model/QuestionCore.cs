using System;
using System.Runtime.Serialization;

namespace Gestprojet.Core.ApiParamSociete.Client.Model
{
    [DataContract]
    public class QuestionCore
    {
        [DataMember(Name="id", EmitDefaultValue=false)]
        public string Id { get; set; } = string.Empty;

        [DataMember(Name="evaluationId", EmitDefaultValue=false)]
        public string EvaluationId { get; set; } = string.Empty;

        [DataMember(Name="texte", EmitDefaultValue=false)]
        public string Texte { get; set; } = string.Empty;

        [DataMember(Name="type", EmitDefaultValue=false)]
        public string Type { get; set; }

        [DataMember(Name="options", EmitDefaultValue=false)]
        public string Options { get; set; }

        [DataMember(Name="noteMaximale", EmitDefaultValue=false)]
        public decimal NoteMaximale { get; set; }
    }
}
