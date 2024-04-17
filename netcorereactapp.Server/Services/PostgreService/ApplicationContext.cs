using ClassesLibrary.Models;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Services.PostgreService
{
    public class ApplicationContext : DbContext
    {
        public DbSet<LoginModel> Users { get; set; } = null!;

        public DbSet<OrderModels> Orders { get; set; } = null!;
        public DbSet<StatusModels> StatusesOfOrders { get; set; } = null!;
        public DbSet<AttachmentModels> AttachmentsOfStatuses { get; set; } = null!;
        public DbSet<StatusEvent> StatusEventsOfModels { get; set; } = null!;

        public DbSet<Procces>Procceses { get; set; } = null!;
        public DbSet<Operation> Operations { get; set; } = null!;
        public DbSet<Attachment> Attachemnts { get; set; } = null!;
        public DbSet<ClassesLibrary.Models.History> Histories { get; set; } = null!;
        public DbSet<Equipment>Equipments { get; set; } = null!;
        private readonly ILogger<ApplicationContext> _logger;
        public ApplicationContext(DbContextOptions<ApplicationContext> options, ILogger<ApplicationContext> logger)
            : base(options)
        {
            //_logger = logger;
            //_logger.LogInformation("ApplicationContext created.");
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder => builder.AddConsole()));
            //optionsBuilder.ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.MultipleCollectionIncludeWarning));
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Old dbset structure
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
                .HasOne(statusEvent => statusEvent.Order)
                .WithMany(ev => ev.StatusEvents)
                .HasForeignKey(ev => ev.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            #endregion

            #region
            modelBuilder.Entity<Operation>()
               .HasMany(operation => operation.Attachments)
               .WithOne(attachment => attachment.Operation)
               .HasForeignKey(attachment => attachment.OperationId)
               .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Operation>()
                .HasOne(operation => operation.Procces)
                .WithMany(procces => procces.Operations)
                .HasForeignKey(operation => operation.ProccesId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Operation>()
                .HasMany(operation => operation.ChildsOperations)
                .WithOne(childOperation => childOperation.ParentOperation)
                .HasForeignKey(childOperation => childOperation.ParentOperationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClassesLibrary.Models.History>()
               .HasOne(history => history.Procces)
               .WithMany(procces => procces.Histories)
               .HasForeignKey(history => history.ProccesId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attachment>()
                .HasOne(attachment => attachment.Procces)
                .WithMany(procces => procces.Attachments)
                .HasForeignKey(fk => fk.ProccedId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Attachment>()
                .Property(a => a.Category)
                .IsRequired(false); // Разрешаем значение NULL для столбца категории

            modelBuilder.Entity<Equipment>()
                .HasOne(equipment => equipment.Operation)
                .WithMany(operation => operation.Equipments)
                .HasForeignKey(fk => fk.OperationId)
                .OnDelete(DeleteBehavior.Cascade);
            #endregion
        }
        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries<Attachment>().Where(e => e.State == EntityState.Deleted))
            {
                // Удаление связанного файла
                if (entry.Entity.AttachmentData != null)
                {
                    File.Delete(entry.Entity.AttachmentData);
                }
            }

            return base.SaveChanges();
        }
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            foreach (var entry in ChangeTracker.Entries<Attachment>().Where(e => e.State == EntityState.Deleted))
            {
                // Удаление связанного файла
                if (entry.Entity.AttachmentData != null)
                {
                    File.Delete(entry.Entity.AttachmentData);
                }
            }

            // Вызываем базовую реализацию метода SaveChangesAsync
            return await base.SaveChangesAsync(cancellationToken);
        }
        public override void Dispose()
        {
            //_logger.LogInformation("ApplicationContext disposed.");
            base.Dispose();
        }
    }
}