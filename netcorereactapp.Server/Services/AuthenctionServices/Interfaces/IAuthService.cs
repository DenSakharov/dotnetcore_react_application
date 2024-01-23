namespace netcorereactapp.Server.Services.AuthenctionServices.Interfaces
{
    public interface IAuthService
    {
        string Get_Token(string login,string role);
    }
}
