using System.Text.Json.Serialization;

namespace netcorereactapp.Server.Models
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        [JsonIgnore]
        public OrderModels Order { get; set; } = null!;
        [JsonIgnore]
        public List<StatusEvent> StatusEvents { get; set; } = new List<StatusEvent>();
    }
}
