namespace netcorereactapp.Server.Models
{
    public class StatusEvent
    {
        public int Id { get; set; }
        public DateTime DateOfChange { get; set; }

        // Внешний ключ для связи с моделью статуса
        public int StatusModelId { get; set; }

        // Навигационное свойство для доступа к связанной модели статуса
        public StatusModels StatusModel { get; set; }

    }
}
