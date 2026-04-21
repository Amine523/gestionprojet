namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ChatRoomCore
    {
        public string Id { get; set; }
        public string Nom { get; set; }
        public string ProjetId { get; set; }
        public bool? Actif { get; set; }
    }
}
