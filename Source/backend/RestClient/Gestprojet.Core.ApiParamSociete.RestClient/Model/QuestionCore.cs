using System;
using System.Runtime.Serialization;

namespace Gestprojet.Core.ApiParamSociete.Client.Model
{
    [DataContract(Name = "QuestionCore")]
    public partial class QuestionCore
    {
        [DataMember(Name = "id", EmitDefaultValue = false)]
        public string Id { get; set; }
        [DataMember(Name = "evaluationId", EmitDefaultValue = false)]
        public string EvaluationId { get; set; }
        [DataMember(Name = "texte", EmitDefaultValue = false)]
        public string Texte { get; set; }
        [DataMember(Name = "type", EmitDefaultValue = false)]
        public string Type { get; set; }
        [DataMember(Name = "options", EmitDefaultValue = false)]
        public string Options { get; set; }
        [DataMember(Name = "noteMaximale", EmitDefaultValue = true)]
        public int NoteMaximale { get; set; }
    }
}
