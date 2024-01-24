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
        private readonly IConfiguration _configuration;
        public PostgreService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        DbContextOptions<ApplicationContext> getoptons()
        {
            string str_connect = _configuration["Configuration:db"];
            return new DbContextOptionsBuilder<ApplicationContext>()
            .UseNpgsql(str_connect)
            .Options;
        }
        public List<T> GetData<T>() where T : class
        {
            using (ApplicationContext db = new ApplicationContext(getoptons()))
            {
                IQueryable<T> query = db.Set<T>();

                return query.ToList();
            }
        }
        public LoginModel CreateUser(LoginModel user) {
            // получение данных

            using (ApplicationContext db = new ApplicationContext(getoptons() ))
            {
                // Создаем объекты для добавления в базу данных
                LoginModel user1 = user;
                db.Users.Add(user1);

                // Сохраняем изменения в базе данных
                try
                {
                    db.SaveChanges();
                    return user1;
                } 
                catch (Exception ex)
                {
                    var test = ex.InnerException.Message;
                }
            }
            return null;
        }
        public LoginModel IsExistingUserInDB(string username)
        {
            // получение данных
            using (ApplicationContext db = new ApplicationContext(getoptons() ))
            {
                var user = db.Users.Where(x => x.Login == username).FirstOrDefault();
                return user;
            }
            return null;
        }
    }
}
