namespace ClassesLibrary.Models
{
    public class Attachemnt:Entity
    {
        public string AttachmentData { get; set; }
        // Внешний ключ для связи с Operation
        public int OperationId { get; set; }
        // Навигационное свойство для доступа к связанной модели операции
        public Operation Operation { get; set; }
        public int ProccedId { get; set; }
        public Procces Procces { get; set; }    
    }
}
