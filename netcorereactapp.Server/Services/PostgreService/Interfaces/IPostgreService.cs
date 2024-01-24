using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Services.AuthenctionServices.Interfaces
{
    public interface IPostgreService
    {
        string GetData(string username);
        LoginModel IsExistingUserInDB(string username);
        LoginModel CreateUser(LoginModel user);
    }
}
