using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class ApplicationContext : DbContext
    {
        public DbSet<LoginModel> Users { get; set; } = null!;

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LoginModel>()
                .HasIndex(u => u.Login)
                .IsUnique();
        }
    }
}