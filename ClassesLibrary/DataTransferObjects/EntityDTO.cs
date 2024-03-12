using System.ComponentModel.DataAnnotations;

namespace ClassesLibrary.DataTransferObjects
{
    public class EntityDTO
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string Caption { get; set; }
        public DateTime DateOfCreture { get; set; }
        public DateTime DateOfEdited { get; set; }
    }
}
