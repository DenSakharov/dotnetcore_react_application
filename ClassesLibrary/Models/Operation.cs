using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Operation : Entity
    {
        [JsonIgnore]
        public int? ProccesId { get; set; }
        [JsonIgnore]
        public Procces Procces { get; set; }
        [JsonIgnore]
        public int? ParentOperationId { get; set; }  
        [JsonIgnore]
        public Operation ParentOperation { get; set; }  
        [JsonIgnore]
        public List<Operation> ChildsOperations { get; set; } = new List<Operation>();
        [JsonIgnore]
        public List<Attachemnt> Attachments { get; set; } = new List<Attachemnt>();
    }
}
