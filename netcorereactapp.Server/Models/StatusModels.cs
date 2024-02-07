using System.Text.Json.Serialization;

namespace netcorereactapp.Server.Models
{
    public enum TypesStatus
    {
        Start,
        Proccess,
        End
    }

    public class StatusModels
    {
        public int Id { get; set; }
        public TypesStatus type { get; set; }
        public DateTime date_of_creature { get; set; }
        [JsonIgnore]
        public List<AttachmentModels> Attachments { get; set; } = new List<AttachmentModels>();
        [JsonIgnore]
        public int OrderId { get; set; }
        [JsonIgnore]
        public OrderModels Order { get; set; }
    }
}
