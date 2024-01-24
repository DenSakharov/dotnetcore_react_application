using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace netcorereactapp.Server.Models
{
    public class LoginModel
    {
        [Key]
        public int id {  get; set; }
        [Required]
        [MaxLength(255)] 
        public string Login { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
    }

}
