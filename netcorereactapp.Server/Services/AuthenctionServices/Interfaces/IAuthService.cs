namespace netcorereactapp.Server.Services.AuthenctionServices.Interfaces
{
    public interface IAuthService
    {
        Task<string> Get_Token(string login,string role);
    }
}
