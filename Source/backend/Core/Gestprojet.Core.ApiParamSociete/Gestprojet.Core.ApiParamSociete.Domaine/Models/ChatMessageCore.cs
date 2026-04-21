namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ChatMessageCore
    {
        public string Id { get; set; }
        public string ChatRoomId { get; set; }
        public string ExpediteurId { get; set; }
        public string Message { get; set; }
        public DateTime? DateEnvoi { get; set; }
        public bool? EstLu { get; set; }
    }
}
