using ClassesLibrary.Models;

namespace ClassesLibrary.DataTransferObjects
{
    public class AttachmentDTO : EntityDTO
    {
        public string AttachmentData { get; set; }
        // Внешний ключ для связи с StatusModels
        public int OperationId { get; set; }
        // Навигационное свойство для доступа к связанной модели статуса
        public OperationDTO Operation { get; set; }
        public AttachmentCategoryType? Category { get; set; }
    }
}
