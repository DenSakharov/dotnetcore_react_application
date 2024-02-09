using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Services.AuthenctionServices.Interfaces
{
    public interface IPostgreService
    {
        List<T> GetData<T>()where T : class;
        LoginModel IsExistingUserInDB(string username);
        Task<LoginModel> CreateUser(LoginModel user);
    }
}
