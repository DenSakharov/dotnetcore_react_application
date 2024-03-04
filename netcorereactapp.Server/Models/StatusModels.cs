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
        [JsonIgnore]
        public int? ParentStatusId { get; set; }  // Nullable int to indicate parent status
        [JsonIgnore]
        public StatusModels ParentStatus { get; set; }  // Navigation property for parent status
        [JsonIgnore]
        public List<StatusModels> ChildStatuses { get; set; } = new List<StatusModels>();
    }
}
