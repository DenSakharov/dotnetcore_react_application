namespace netcorereactapp.Server.Models.DataTransferObjects
{
    public class StatusEventDTO
    {
        // Свойства модели события статуса
        public int Id { get; set; }
        public DateTime DateOfChange { get; set; }
        public string Message { get; set; }
    }
}
