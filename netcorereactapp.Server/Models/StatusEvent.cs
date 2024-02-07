using System.Text.Json.Serialization;

namespace netcorereactapp.Server.Models
{
    public class StatusEvent
    {
        public int Id { get; set; }
        public DateTime DateOfChange { get; set; }
        public string Message {  get; set; }
        public int OrderId { get; set; }
        public OrderModels Order { get; set; }
    }
}
