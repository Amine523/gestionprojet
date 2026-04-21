namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class ContactCore
    {
        public string Id { get; set; }
        public string SocieteId { get; set; }
        public string Nom { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public bool? Actif { get; set; }
    }
}
