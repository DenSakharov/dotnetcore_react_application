using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Procces : Entity
    {
        [JsonIgnore]
        public List<Operation> Operations { get; set; } = new List<Operation>();
        [JsonIgnore]
        public List<History> Histories { get; set; } = new List<History>();
        [JsonIgnore]
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
    }
}
