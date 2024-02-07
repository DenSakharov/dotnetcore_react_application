using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace netcorereactapp.Server.Models
{
    public class OrderModels
    {
        [Key]
        public int id {  get; set; }
        [Required]
        [MaxLength(255)]
        public string caption { get; set; }
        public DateTime date_of_creature { get; set; }
        public DateTime date_of_edited { get; set; }
        [JsonIgnore]
        public List<StatusModels> StatusModels { get; set; }=new List< StatusModels>();
        [JsonIgnore]
        public List<StatusEvent> StatusEvents { get; set; } = new List<StatusEvent>();
    }
}
