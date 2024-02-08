using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Models.DataTransferObjects
{
    public class StatusDTO
    {
        // Свойства модели статуса
        public int Id { get; set; }
        public TypesStatus Type { get; set; }
        public DateTime DateOfCreature { get; set; }
        public List<AttacmentDTO> Attachments { get; set; } = new List<AttacmentDTO>();
    }
}
