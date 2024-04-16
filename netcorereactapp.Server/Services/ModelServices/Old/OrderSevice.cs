using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Old.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using System.Text;

namespace netcorereactapp.Server.Services.ModelServices.Old
{
    public class OrderSevice : IOrderService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrderSevice> _logger;
        private readonly IFileService _fileService;
        public OrderSevice(ApplicationContext dbContext, ILogger<OrderSevice> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        public async Task<IEnumerable<OrderDTO>> GetOrders()
        {
            try
            {
                var orders = await _dbContext.Orders
                    .Include(o => o.StatusModels)
                    .ThenInclude(s => s.Attachments)
                    .Include(o => o.StatusEvents)
                    .ToListAsync();
                var list_of_attachments = new List<AttachmentDTO>();
                var orderDTOs = orders.Select(order => new OrderDTO
                {
                    Id = order.id,
                    Caption = order.caption,
                    DateOfCreature = order.date_of_creature,
                    DateOfEdited = order.date_of_edited,
                    Statuses = order.StatusModels.Select(status => new StatusDTO
                    {
                        Id = status.Id,
                        Type = status.type,
                        ParentId = status.ParentStatusId.HasValue ? status.ParentStatusId.Value : 0,
                        DateOfCreature = status.date_of_creature,
                        Attachments = MapAttachments(status.Attachments),
                        //ChildStatuses= status.ChildStatuses.Count != 0 ? rewrite_array_to_ChildStatusesDTO(status) : new List<StatusDTO>()
                    }).ToList(),
                    Events = order.StatusEvents.Select(status => new StatusEventDTO
                    {
                        DateOfChange = status.DateOfChange,
                        Id = status.Id,
                        Message = status.Message
                    }).ToList()
                });
                _logger.LogInformation("DateOfCreature - " + orderDTOs.LastOrDefault().Statuses.FirstOrDefault()
                    .Attachments.FirstOrDefault().AttachmentData);
                return orderDTOs;
            }
            catch (Exception ex)
            {
                _logger.LogError("" + ex);
                return null;
            }
        }
        public async Task<OrderDTO> GetOrder(int id)
        {
            try
            {
                var order = await _dbContext.Orders.Where(o => o.id == id)
                    .Include(o => o.StatusModels)
                    .ThenInclude(s => s.Attachments)
                    .Include(o => o.StatusEvents)
                    .FirstOrDefaultAsync();

                var orderDTO = new OrderDTO
                {
                    Id = order.id,
                    Caption = order.caption,
                    DateOfCreature = order.date_of_creature,
                    DateOfEdited = order.date_of_edited,
                    Statuses = MapChildStatuses(order.StatusModels), // Вызываем метод маппинга для дочерних статусов
                    Events = order.StatusEvents.Select(status => new StatusEventDTO
                    {
                        DateOfChange = status.DateOfChange,
                        Id = status.Id,
                        Message = status.Message
                    }).ToList()
                };

                return orderDTO;
            }
            catch (Exception ex)
            {
                _logger.LogError("" + ex);
                return null;
            }
        }

        #region
        /*public async Task<OrderDTO> GetOrder(int id)
        {
            try
            {
                var order = await _dbContext.Orders.Where(o => o.id == id)
                    .Include(o => o.StatusModels)
                    .ThenInclude(s => s.Attachments)
                    .Include(o => o.StatusEvents)
                    .FirstOrDefaultAsync();
               *//* StringBuilder sb = new StringBuilder();
                foreach (StatusModels status in order.StatusModels)
                {
                    ProcessChildStatuses(status, sb);
                }
                Console.WriteLine("\n\n\n" + sb.ToString() + "\n\n\n");*//*
                var list_of_attachments = new List<AttachmentDTO>();
                var orderDTOs = new OrderDTO
                {
                    Id = order.id,
                    Caption = order.caption,
                    DateOfCreature = order.date_of_creature,
                    DateOfEdited = order.date_of_edited,
                    Statuses = order.StatusModels.Select(status => new StatusDTO
                    {
                        Id = status.Id,
                        Type = status.type,
                        ParentId = status.ParentStatusId.HasValue ? status.ParentStatusId.Value : 0,
                        DateOfCreature = status.date_of_creature,
                        Attachments = rewrite_array_to_AttachmentDTO(status.Attachments),
                        ChildStatuses = status.ChildStatuses.Count!=0 ? rewrite_array_to_ChildStatusesDTO(status) : new List<StatusDTO>()
                    }).ToList(),
                    Events = order.StatusEvents.Select(status => new StatusEventDTO
                    {
                        DateOfChange = status.DateOfChange,
                        Id = status.Id,
                        Message = status.Message
                    }).ToList()
                };
               *//* try
                {
                    _logger.LogInformation("DateOfCreature - " + orderDTOs.Statuses.FirstOrDefault()
                        .Attachments.FirstOrDefault().AttachmentData);
                }
                finally
                {

                }*/

        /*  sb =new StringBuilder();
          foreach (StatusDTO statusDTO in orderDTOs.Statuses)
          {
              ProcessChildStatusesDTO(statusDTO,sb);
          }
          Console.WriteLine("\n\n\n"+sb.ToString()+ "\n\n\n");*//*
          return orderDTOs;
      }
      catch (Exception ex)
      {
          _logger.LogError("" + ex);
          return null;
      }
  }*/

        void ProcessChildStatuses(StatusModels statusDTO, StringBuilder sb)
        {
            // Проверяем, есть ли у статуса дочерние статусы
            if (statusDTO.ChildStatuses.Count != 0)
            {
                // Обрабатываем каждый дочерний статус
                foreach (var childStatus in statusDTO.ChildStatuses)
                {
                    sb.AppendLine("parent -> " + statusDTO.Id + " ; child -> " + childStatus.Id);
                    ProcessChildStatuses(childStatus, sb);
                }
            }
        }
        void ProcessChildStatusesDTO(StatusDTO statusDTO, StringBuilder sb)
        {
            // Проверяем, есть ли у статуса дочерние статусы
            if (statusDTO.ChildStatuses.Count != 0)
            {
                // Обрабатываем каждый дочерний статус
                foreach (var childStatus in statusDTO.ChildStatuses)
                {
                    sb.AppendLine("parent -> " + statusDTO.Id + " ; child -> " + childStatus.Id);
                    ProcessChildStatusesDTO(childStatus, sb);
                }
            }
        }
        private List<AttachmentDTO> MapAttachments
           (List<AttachmentModels> attachmentModels)
        {
            var list_of_AttacmentDTO = new List<AttachmentDTO>();
            foreach (var attachmentModel in attachmentModels)
            {
                var e = new AttachmentDTO();
                e.AttachmentData = attachmentModel.AttachmentData;
                e.Id = attachmentModel.Id;
                list_of_AttacmentDTO.Add(e);
            }
            return list_of_AttacmentDTO;
        }
        /*  private List<StatusDTO> rewrite_array_to_ChildStatusesDTO
            (StatusModels statusModel)
          {
              var list_of_AttacmentDTO = new List<StatusDTO>();

              var e = new StatusDTO();
              e.DateOfCreature = statusModel.date_of_creature;
              e.Attachments = MapAttachments(statusModel.Attachments);
              e.Type = statusModel.type;
              e.Id = statusModel.Id;
              e.ParentId = statusModel.ParentStatusId.HasValue ? statusModel.ParentStatusId.Value : 0;
              // Проверяем наличие дочерних статусов
              if (statusModel.ChildStatuses != null && statusModel.ChildStatuses.Count!=0)
              {
                  // Рекурсивно вызываем функцию для каждого дочернего статуса
                  foreach (var childStatus in statusModel.ChildStatuses)
                  {
                      e.ChildStatuses = rewrite_array_to_ChildStatusesDTO(childStatus);
                  }
              }
              list_of_AttacmentDTO.Add(e);
              return list_of_AttacmentDTO;
          }*/
        #endregion
        private List<StatusDTO> MapChildStatuses(List<StatusModels> allStatuses)
        {
            var childStatusDTOs = new List<StatusDTO>();
            foreach (var status in allStatuses)
            {
                // Проверяем, соответствует ли родительский идентификатор
                if (status.ParentStatusId == null)
                {
                    // Создаем и добавляем дочерний статус в список
                    var childStatusDTO = new StatusDTO
                    {
                        Id = status.Id,
                        Type = status.type,
                        DateOfCreature = status.date_of_creature,
                        ParentId = status.ParentStatusId,
                        Attachments = MapAttachments(status.Attachments),
                        ChildStatuses = MapChildStatusesRecursive(allStatuses, status.Id) // Рекурсивный вызов для вложенных статусов
                    };
                    childStatusDTOs.Add(childStatusDTO);
                }
            }
            return childStatusDTOs;
        }
        List<StatusDTO> MapChildStatusesRecursive(List<StatusModels> childStatuses, int parentId)
        {
            var childStatusDTOs = new List<StatusDTO>();
            foreach (var childStatus in childStatuses)
            {
                // Проверяем, соответствует ли родительский идентификатор
                if (childStatus.ParentStatusId == parentId)
                {
                    // Создаем и добавляем дочерний статус в список
                    var childStatusDTO = new StatusDTO
                    {
                        Id = childStatus.Id,
                        Type = childStatus.type,
                        DateOfCreature = childStatus.date_of_creature,
                        ParentId = childStatus.ParentStatusId,
                        Attachments = MapAttachments(childStatus.Attachments),
                        ChildStatuses = MapChildStatusesRecursive(childStatus.ChildStatuses, childStatus.Id)
                    };
                    childStatusDTOs.Add(childStatusDTO);
                }
            }
            return childStatusDTOs;
        }
        private readonly string path_to_files = "C:\\Uploads";
        public async Task<OrderModels> CreateOrder(IFormFile file, string capt)
        {
            try
            {
                string temp_file_name = await _fileService.SaveFile(file);

                var newlst = new List<StatusModels>();
                // Сохраняем путь к файлу в базу данных
                var attachment = new AttachmentModels
                {
                    AttachmentData = temp_file_name,
                };
                newlst.Add(new StatusModels
                {
                    date_of_creature = DateTime.UtcNow,
                    type = TypesStatus.Start,
                    Attachments = new List<AttachmentModels> { attachment },
                });
                var newOrder = new OrderModels
                {
                    caption = capt,
                    date_of_creature = DateTime.UtcNow,
                    date_of_edited = DateTime.UtcNow,
                    StatusModels = newlst
                };
                _dbContext.Orders.Add(
                    newOrder);
                // Добавление нового заказа в контекст базы данных
                await _dbContext.SaveChangesAsync();

                var lastCreatedOrder = _dbContext.Orders.OrderByDescending(o => o.id).FirstOrDefault();

                // Создание нового объекта StatusEvent (история создания)
                var statusEvent = new StatusEvent
                {
                    OrderId = lastCreatedOrder.id,
                    DateOfChange = DateTime.UtcNow,
                    Message = $"Новое событие: создание нового заказа под номером {lastCreatedOrder.id}",
                };
                _dbContext.StatusEventsOfModels.Add(statusEvent);
                await _dbContext.SaveChangesAsync();
                return newOrder;
            }
            catch (Exception ex)
            {
                _logger.LogCritical("" + ex);
                return null;
            }
        }

        public async Task<int> UpdateStatus(int orderId, string statu, IFormFile file)
        {
            try
            {
                TypesStatus status = (TypesStatus)Enum.Parse(typeof(TypesStatus), statu);
                // Получаем заказ из базы данных
                var existingOrder = await _dbContext.Orders
                    .Include(o => o.StatusModels)
                    .FirstOrDefaultAsync(o => o.id == orderId);

                // Проверяем, существует ли заказ с указанным ID
                if (existingOrder == null)
                {
                    return 0;
                }

                if (existingOrder.StatusModels != null)
                {

                    // Создание нового объекта StatusEvent (история создания)
                    var lastStatusIndex = existingOrder.StatusModels.Count - 1; // Индекс предыдущего статуса
                    var previousStatus = existingOrder.StatusModels.ElementAtOrDefault(lastStatusIndex);

                    var statusEvent = new StatusEvent
                    {
                        OrderId = orderId,
                        DateOfChange = DateTime.UtcNow,
                        Message =
                        $"Новое событие: Изменение статуса заказа под номером {orderId}" +
                        $" с {previousStatus.type}" +
                        $" на {status}",
                    };
                    string path = await _fileService.SaveFile(file);
                    existingOrder.date_of_edited = statusEvent.DateOfChange;
                    existingOrder.StatusModels.Add(
                        new StatusModels
                        {
                            type = status,
                            date_of_creature = DateTime.UtcNow,
                            Attachments = new List<AttachmentModels> {
                                new AttachmentModels
                                {
                                    AttachmentData=path
                                }
                            }
                        });

                    _dbContext.StatusEventsOfModels.Add(statusEvent);
                }
                await _dbContext.SaveChangesAsync();
            }
            finally { _dbContext.Dispose(); }
            return orderId;
        }
    }
}
