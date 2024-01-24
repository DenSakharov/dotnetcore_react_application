using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using System.Data;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class PostgreService : IPostgreService
    {
        private readonly IConfiguration _configuration;
        public PostgreService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetData(string username)
        {
            throw new NotImplementedException();
        }
        public LoginModel CreateUser(LoginModel user) {
            // получение данных
            string str_connect = _configuration["Configuration:db"];
            var options = new DbContextOptionsBuilder<ApplicationContext>()
            .UseNpgsql(str_connect)
            .Options;
            using (ApplicationContext db = new ApplicationContext(options))
            {
                // Создаем объекты для добавления в базу данных
                LoginModel user1 = user;
                db.Users.Add(user1);

                // Сохраняем изменения в базе данных
                db.SaveChanges();
                return user1;
            }
            return null;
        }
        public LoginModel IsExistingUserInDB(string username)
        {
            // получение данных
            string str_connect = _configuration["Configuration:db"];
            var options = new DbContextOptionsBuilder<ApplicationContext>()
            .UseNpgsql(str_connect) 
            .Options;
            using (ApplicationContext db = new ApplicationContext(options))
            {
                var user = db.Users.Where(x => x.Login == username).FirstOrDefault();
                return user;
            }
            return null;
        }
    }
}
