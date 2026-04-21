using System.Collections.Generic;

namespace Gestprojet.Metier.ApiParamSociete.Domain.Models.Messages
{
    public class ResultatPage<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
