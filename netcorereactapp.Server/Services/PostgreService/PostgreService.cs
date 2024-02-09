using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using System.Data;
using System.Linq;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class PostgreService : IPostgreService
    {
        private readonly ApplicationContext _applicationContext;
        private readonly IConfiguration _configuration;
        public PostgreService(ApplicationContext dbContext, IConfiguration configuration)
        {
            _applicationContext = dbContext;
            _configuration = configuration;
        }
        public List<T> GetData<T>() where T : class
        {
            // Получаем таблицу пользователей из контекста базы данных
            DbSet<T> users = _applicationContext.Set<T>();

            // Выполняем запрос и преобразуем результат в список
            return users.ToList();
        }
        public async Task<LoginModel> CreateUser(LoginModel user)
        {
            LoginModel user1 = user;
            _applicationContext.Users.Add(user1);
            try
            {
                await _applicationContext.SaveChangesAsync();
                return user1;
            }
            catch (Exception ex)
            {
                var test = ex.InnerException.Message;
            }

            return null;
        }
        public LoginModel IsExistingUserInDB(string username)
        {
            try
            {
                var user = _applicationContext.Users.Where(x => x.Login == username).FirstOrDefault();
                return user;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
