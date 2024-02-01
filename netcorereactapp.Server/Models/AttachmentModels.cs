namespace netcorereactapp.Server.Models
{
    public class AttachmentModels
    {
        public int Id { get; set; }
        public string AttachmentData { get; set; }
        // Внешний ключ для связи с StatusModels
        public int StatusModelId { get; set; }
        // Навигационное свойство для доступа к связанной модели статуса
        public StatusModels StatusModel { get; set; }
    }
}
