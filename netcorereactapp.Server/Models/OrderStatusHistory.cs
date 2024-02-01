namespace netcorereactapp.Server.Models
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public OrderModels Order { get; set; } = null!;

        public List<StatusEvent> StatusEvents { get; set; } = new List<StatusEvent>();
    }
}
