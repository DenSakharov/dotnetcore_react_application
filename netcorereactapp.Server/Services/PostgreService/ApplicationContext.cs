using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class ApplicationContext : DbContext
    {
        public DbSet<LoginModel> Users { get; set; } = null!;
        public DbSet<OrderModels> Orders { get; set; } = null!;
        public DbSet<StatusModels> Statuses { get; set; } = null!;
        public DbSet<AttachmentModels> Attachments { get; set; } = null!;

        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; } = null!;
        public DbSet<StatusEvent> StatusEvents { get; set; } = null!;
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LoginModel>()
                .HasIndex(u => u.Login)
                .IsUnique();
            modelBuilder.Entity<OrderModels>()
                .HasIndex(u => u.caption)
                .IsUnique();
            modelBuilder.Entity<StatusModels>()
                .HasMany(status => status.Attachments)
                .WithOne(attachment => attachment.StatusModel)
                .HasForeignKey(attachment => attachment.StatusModelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderStatusHistory>()
                .HasOne(history => history.Order)
                .WithMany(order => order.StatusHistories) 
                .HasForeignKey(history => history.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            //связь со моделью статуса заказа
            modelBuilder.Entity<StatusEvent>()
                .HasOne(ev => ev.StatusModel)
                .WithMany(status => status.StatusEvents)  
                .HasForeignKey(ev => ev.StatusModelId)
                .OnDelete(DeleteBehavior.Cascade);
            //связь с моделью истории изименения статуса 
            modelBuilder.Entity<StatusEvent>()
                .HasOne(ev => ev.OrderStatusHistory)
                .WithMany(history => history.StatusEvents)
                .HasForeignKey(ev => ev.OderStatusHistoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}