using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using Newtonsoft.Json;

namespace Gestprojet.Core.ApiParamSociete.Client.Model
{
    [DataContract]
    public partial class DemandeCongeCore : IEquatable<DemandeCongeCore>
    {
        [DataMember(Name="id", EmitDefaultValue=false)]
        public string Id { get; set; }

        [DataMember(Name="utilisateurId", EmitDefaultValue=false)]
        public string UtilisateurId { get; set; }

        [DataMember(Name="societeId", EmitDefaultValue=false)]
        public string SocieteId { get; set; }

        [DataMember(Name="typePointageId", EmitDefaultValue=false)]
        public string TypePointageId { get; set; }

        [DataMember(Name="dateDebut", EmitDefaultValue=false)]
        public DateTime? DateDebut { get; set; }

        [DataMember(Name="dateFin", EmitDefaultValue=false)]
        public DateTime? DateFin { get; set; }

        [DataMember(Name="status", EmitDefaultValue=false)]
        public string Status { get; set; }

        [DataMember(Name="motif", EmitDefaultValue=false)]
        public string Motif { get; set; }

        [DataMember(Name="avecCertificat", EmitDefaultValue=false)]
        public bool AvecCertificat { get; set; }

        [DataMember(Name="jours", EmitDefaultValue=false)]
        public int Jours { get; set; }

        [DataMember(Name="dateCreation", EmitDefaultValue=false)]
        public DateTime? DateCreation { get; set; }

        [DataMember(Name="valideParId", EmitDefaultValue=false)]
        public string ValideParId { get; set; }

        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class DemandeCongeCore {\n");
            sb.Append("  Id: ").Append(Id).Append("\n");
            sb.Append("  UtilisateurId: ").Append(UtilisateurId).Append("\n");
            sb.Append("  SocieteId: ").Append(SocieteId).Append("\n");
            sb.Append("  Status: ").Append(Status).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }

        public bool Equals(DemandeCongeCore input)
        {
            if (input == null) return false;
            return this.Id == input.Id;
        }
    }

    [DataContract]
    public partial class JourFerieCore : IEquatable<JourFerieCore>
    {
        [DataMember(Name="id", EmitDefaultValue=false)]
        public string Id { get; set; }

        [DataMember(Name="societeId", EmitDefaultValue=false)]
        public string SocieteId { get; set; }

        [DataMember(Name="nom", EmitDefaultValue=false)]
        public string Nom { get; set; }

        [DataMember(Name="date", EmitDefaultValue=false)]
        public DateTime Date { get; set; }

        [DataMember(Name="actif", EmitDefaultValue=false)]
        public bool Actif { get; set; }

        public bool Equals(JourFerieCore input)
        {
            if (input == null) return false;
            return this.Id == input.Id;
        }
    }
}
