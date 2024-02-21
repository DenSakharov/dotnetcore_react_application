using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using System.Text.Json.Nodes;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class OrderSevice : IOrderService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrderSevice> _logger;
        private readonly IFileService _fileService;
        public OrderSevice(ApplicationContext dbContext , ILogger<OrderSevice> logger,IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        public async Task< IEnumerable<OrderDTO>> GetOrders()
        {
            try
            {
                var orders = await _dbContext.Orders
                    .Include(o => o.StatusModels)
                    .ThenInclude(s => s.Attachments)
                    .Include(o => o.StatusEvents)
                    .ToListAsync();
                var list_of_attachments = new List<AttacmentDTO>();
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
                        DateOfCreature = status.date_of_creature,
                        Attachments = rewrite_array(status.Attachments),
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
                _logger.LogError(""+ex);
                return null;
            }
        }
        private List<AttacmentDTO> rewrite_array
           (List<AttachmentModels> attachmentModels)
        {
            var list_of_AttacmentDTO = new List<AttacmentDTO>();
            foreach (var attachmentModel in attachmentModels)
            {
                var e = new AttacmentDTO();
                e.AttachmentData = attachmentModel.AttachmentData;
                e.Id = attachmentModel.Id;
                list_of_AttacmentDTO.Add(e);
            }
            return list_of_AttacmentDTO;
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
            catch(Exception ex) 
            {
                _logger.LogCritical(""+ex);
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
                    string path=await _fileService.SaveFile(file);
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
