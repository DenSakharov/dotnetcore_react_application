using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Controllers.Orders;
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
        private readonly ILogger<ApplicationContext> _logger;
        public ApplicationContext(DbContextOptions<ApplicationContext> options, ILogger<ApplicationContext> logger)
            : base(options)
        {
            _logger = logger;
            _logger.LogInformation("ApplicationContext created.");
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

            modelBuilder.Entity<StatusModels>()
                .HasMany(status => status.ChildStatuses)           // Один родительский статус имеет много дочерних статусов
                .WithOne(childStatus => childStatus.ParentStatus) // Каждый дочерний статус имеет один родительский статус
                .HasForeignKey(childStatus => childStatus.ParentStatusId) // Внешний ключ для связи дочерних статусов с родительским статусом
                .OnDelete(DeleteBehavior.Cascade); // При удалении родительского статуса, дочерние статусы также будут удалены

            modelBuilder.Entity<StatusEvent>()
                .HasOne(order => order.Order)
                .WithMany(ev => ev.StatusEvents)
                .HasForeignKey(ev => ev.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        public override void Dispose()
        {
            _logger.LogInformation("ApplicationContext disposed.");
            base.Dispose();
        }
    }
}