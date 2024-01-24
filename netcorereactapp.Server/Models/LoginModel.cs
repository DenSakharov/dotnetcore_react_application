using System.ComponentModel.DataAnnotations;

namespace netcorereactapp.Server.Models
{
    public class LoginModel
    {
        [Key]
        public int id {  get; set; }
        public string Login { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
    }

}
