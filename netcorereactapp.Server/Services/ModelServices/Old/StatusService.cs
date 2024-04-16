using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Old.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ModelServices.Old
{
    public class StatusService : IStatusService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<StatusService> _logger;
        private readonly IFileService _fileService;
        public StatusService(ApplicationContext dbContext, ILogger<StatusService> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        public async Task<int> Add_status_to_status(int statID, string type, IFormFile file)
        {
            var selectedStatus = await _dbContext.StatusesOfOrders.FirstOrDefaultAsync(status => status.Id == statID);
            if (selectedStatus != null)
            {
                string temp_file_name = await _fileService.SaveFile(file);
                var listAttachmentModels = new List<AttachmentModels>();

                listAttachmentModels.Add(
                    new AttachmentModels
                    {
                        AttachmentData = temp_file_name
                    });

                var newChildStatus = new StatusModels
                {
                    OrderId = selectedStatus.OrderId,
                    Order = selectedStatus.Order,
                    ParentStatus = selectedStatus,
                    ParentStatusId = statID,
                    date_of_creature = DateTime.UtcNow,
                    type = (TypesStatus)Enum.Parse(typeof(TypesStatus), type),
                    Attachments = listAttachmentModels,
                };

                // Добавляем новый дочерний статус к родительскому статусу
                selectedStatus.ChildStatuses.Add(newChildStatus);

                // Сохраняем изменения в базе данных
                var resp = await _dbContext.SaveChangesAsync();

                // Возвращаем идентификатор только что добавленного статуса
                if (resp > 0)
                {
                    return newChildStatus.Id;
                }
                else
                {
                    return 0;
                }
            }
            else
            {
                return 0;
            }
        }
    }
}
