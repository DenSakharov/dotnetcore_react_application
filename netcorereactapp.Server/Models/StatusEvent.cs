namespace netcorereactapp.Server.Models
{
    public class StatusEvent
    {
        public int Id { get; set; }
        public DateTime DateOfChange { get; set; }
        public string Message {  get; set; }
        public int StatusModelId { get; set; }
        public StatusModels StatusModel { get; set; }
        public int OderStatusHistoryId { get; set; }
        public OrderStatusHistory OrderStatusHistory { get; set; }
    }
}
