namespace Gestprojet.Core.ApiParamSociete.Domain.Models.Commun
{
    public class ResultatPage<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
