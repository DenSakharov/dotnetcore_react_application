using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace netcorereactapp.Server.Controllers.Authentication
{
    public class AuthOptions
    {
       
        public const string ISSUER = "DeVSakharov"; // издатель токена
        public const string AUDIENCE = "MyAuthClient"; // потребитель токена
        
        public const int LIFETIME = 1; // время жизни токена - 1 минута
        public static SymmetricSecurityKey GetSymmetricSecurityKey(string key)
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
        }
    }
}
