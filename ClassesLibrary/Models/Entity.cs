using System.ComponentModel.DataAnnotations;

namespace ClassesLibrary.Models
{
    public class Entity
    {
        [Key]
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreture { get; set; }
        public DateTime DateOfEdited { get; set; }
    }
}
