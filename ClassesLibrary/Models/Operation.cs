using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Operation : Entity
    {
        public int number { get; set; }
        public string laborCost { get; set; }
        public string responsibleGroup { get; set; }
        public List<Equipment> Equipments { get; set; }  = new List<Equipment>();   
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
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
    }
}
