using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class ApplicationContext : DbContext
    {
        public DbSet<LoginModel> Users { get; set; } = null!;
        public DbSet<OrderModels> Orders { get; set; } = null!; 
        public DbSet<StatusModels> StatusesOfOrders { get; set; } = null!;
        public DbSet<AttachmentModels> AttachmentsOfStatuses { get; set; } = null!;
        public DbSet<StatusEvent> StatusEventsOfModels { get; set; } = null!;
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
            modelBuilder.Entity<OrderModels>()
                .HasIndex(u => u.caption)
                .IsUnique();

            modelBuilder.Entity<StatusModels>()
                .HasMany(status => status.Attachments)
                .WithOne(attachment => attachment.StatusModel)
                .HasForeignKey(attachment => attachment.StatusModelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StatusModels>()
                .HasOne(status => status.Order)
                .WithMany(order => order.StatusModels)
                .HasForeignKey(status => status.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StatusEvent>()
                .HasOne(order => order.Order)
                .WithMany(ev => ev.StatusEvents)
                .HasForeignKey(ev => ev.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}