namespace netcorereactapp.Server.Models.DataTransferObjects
{
    public class OrderDTO
    {
        // Свойства модели заказа
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreature { get; set; }
        public DateTime DateOfEdited { get; set; }

        // Свойства связанных статусов и событий
        public List<StatusDTO> Statuses { get; set; }
        public List<StatusEventDTO> Events { get; set; }
    }
}
