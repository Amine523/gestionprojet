namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class BlockedIPCore
    {
        public string Id { get; set; }
        public string IPAddress { get; set; }
        public string Reason { get; set; }
        public DateTime? DateBlocked { get; set; }
    }
}
