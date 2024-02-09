using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class OrderSevice : IOrderService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrderSevice> _logger;
        public OrderSevice(ApplicationContext dbContext , ILogger<OrderSevice> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
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
                string temp_file_name = "";
                if (file != null && file.Length > 0)
                {
                    // Генерируем уникальное имя файла
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName)
                        + DateTime.Now.ToString("yyyyMMddHHmmss")
                    + Path.GetExtension(file.FileName);
                    temp_file_name = Path.Combine(path_to_files, fileName);

                    // Сохраняем файл на диск
                    using (var stream = new FileStream(temp_file_name, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

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
    }
}
