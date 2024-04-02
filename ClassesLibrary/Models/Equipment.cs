using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Equipment:Entity
    {
        [JsonIgnore]
        // Внешний ключ для связи с Operation
        public int? OperationId { get; set; }
        // Навигационное свойство для доступа к связанной модели операции
        [JsonIgnore]
        public Operation Operation { get; set; }
    }
}
