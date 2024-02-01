using System.ComponentModel.DataAnnotations;

namespace netcorereactapp.Server.Models
{
    public enum TypesStatus
    {
        Start,
        Proccess,
        End
    }

    public class StatusModels
    {
        [Key]
        public int id { get; set; }
        public TypesStatus type { get; set; }
        public DateTime date_of_creature { get; set; }
        public List<AttachmentModels> Attachments { get; set; } = new List<AttachmentModels>();

        public List<StatusEvent> StatusEvents { get; set; } = new List<StatusEvent>();
    }
}
