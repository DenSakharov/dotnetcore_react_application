using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Attachemnt:Entity
    {
        public string AttachmentData { get; set; }
        [JsonIgnore]
        // Внешний ключ для связи с Operation
        public int? OperationId { get; set; }
        // Навигационное свойство для доступа к связанной модели операции
        [JsonIgnore]
        public Operation Operation { get; set; }
        [JsonIgnore]
        public int? ProccedId { get; set; }
        [JsonIgnore]
        public Procces Procces { get; set; }    
    }
}
