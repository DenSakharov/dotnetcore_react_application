using System.ComponentModel.DataAnnotations;

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
        //public int status_model_id { get; set; }
        public StatusModels StatusModels { get; set; }
        public List<OrderStatusHistory> StatusHistories { get; set; } = new List<OrderStatusHistory>();
    }
}
