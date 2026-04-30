namespace Gestprojet.Core.ApiParamSociete.Domain.Models
{
    public class CommissionConfig
    {
        public string Id { get; set; } = "COMM_CFG";
        public decimal TauxCommission { get; set; } = 2.5m;
        public string DateModification { get; set; } = DateTime.UtcNow.ToString("o");
    }
}
