using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Attachment : Entity
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

        public AttachmentCategoryType? Category { get; set; }
    }
    public enum AttachmentCategoryType
    {
        Instruction,//инструкция
        Document,//документ
        Model,//модель
        MPK,//МПК
        Agreement//Договор
    }

}
