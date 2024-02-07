using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.PostgreService;
using System.Linq;
using System.Text.Json;

namespace netcorereactapp.Server.Controllers.Orders
{
    public class OrderDTO
    {
        // Свойства модели заказа
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreature { get; set; }
        public DateTime DateOfEdited { get; set; }

        // Свойства связанных статусов и событий
        public List<StatusDTO> Statuses { get; set; }
        public List<StatusEventDTO> Events { get; set; }
    }

    public class StatusDTO
    {
        // Свойства модели статуса
        public int Id { get; set; }
        public TypesStatus Type { get; set; }
        public DateTime DateOfCreature { get; set; }
        public List<AttacmentDTO> Attachments { get; set; } = new List<AttacmentDTO>();
    }
    public class AttacmentDTO
    {
        public int Id { get; set; }
        public string AttachmentData { get; set; }
    }
    public class StatusEventDTO
    {
        // Свойства модели события статуса
        public int Id { get; set; }
        public DateTime DateOfChange { get; set; }
        public string Message { get; set; }
    }
    [Route("orders")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrdersController> _logger;
        public OrdersController(ApplicationContext dbContext, ILogger<OrdersController> logger)
        {
            try
            {
                _dbContext = dbContext;
                _logger = logger;
                logger.LogInformation("OrdersController constructor called.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        [HttpGet("getorders")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
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
                        Attachments= rewrite_array(status.Attachments),
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
                return Ok(orderDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        private List<AttacmentDTO> rewrite_array
            (List<AttachmentModels> attachmentModels)
        {
            var list_of_AttacmentDTO = new List<AttacmentDTO>();
            foreach (var attachmentModel in attachmentModels)
            {
                var e = new AttacmentDTO();
                e.AttachmentData= attachmentModel.AttachmentData;
                e.Id=attachmentModel.Id;
                list_of_AttacmentDTO.Add(e);
            }
            return list_of_AttacmentDTO;
        }
        private readonly string path_to_files = "C:\\Uploads";
        [HttpPost("createorder")]
        public async Task<ActionResult<OrderModels>> CreateOrder()
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var form = Request.Form;
                    var capt = form["caption"];

                    // Пример доступа к файлам
                    //C:\Uploads
                    var file = form.Files.GetFile("StatusModels.Attachments");
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
                   var attachment =new AttachmentModels
                    {
                        AttachmentData = temp_file_name,
                    };
                    newlst.Add(new StatusModels
                    {
                        date_of_creature = DateTime.UtcNow,
                        type = TypesStatus.Start,
                        Attachments=new List<AttachmentModels> { attachment },
                    });
                    _dbContext.Orders.Add(new OrderModels
                    {
                        caption = capt,
                        date_of_creature = DateTime.UtcNow,
                        date_of_edited = DateTime.UtcNow,
                        StatusModels = newlst
                    });
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
                    // Возвращаем созданный заказ
                    return Ok();// CreatedAtAction(nameof(GetOrder), new { id = lastCreatedOrder.id }, lastCreatedOrder);
                }

                return BadRequest("Invalid order data");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderModels>> GetOrder(int orderId)
        {
            var order = await _dbContext.Orders
            .Include(o => o.StatusModels)
            .FirstOrDefaultAsync(o => o.id == orderId);


            if (order == null)
            {
                return NotFound(); // Возвращаем 404 Not Found, если заказ не найден
            }

            return Ok(order); // Возвращаем заказ в случае успеха
        }
        [HttpPut("{orderId}/updatestatus")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] dynamic statusUpdateModel)
        {
            var jsonObject = JsonSerializer.Deserialize<UpdateStatusClass>(statusUpdateModel);

            // Check if jsonObject or selectedStatus is null
            if (jsonObject == null || jsonObject.status == null)
            {
                return BadRequest("Invalid status update data");
            }

            // Use Enum.TryParse to handle invalid enum values
            //if (!Enum.TryParse<TypesStatus>(jsonObject.status, out TypesStatus status))
            //{
            //    return BadRequest("Invalid status value");
            //}

            try
            {
                // Получаем заказ из базы данных
                var existingOrder = await _dbContext.Orders
                    .Include(o => o.StatusModels)
                    .FirstOrDefaultAsync(o => o.id == orderId);

                // Проверяем, существует ли заказ с указанным ID
                if (existingOrder == null)
                {
                    return NotFound("Order not found");
                }

                if (existingOrder.StatusModels != null)
                {
                    TypesStatus status = (TypesStatus)Enum.Parse(typeof(TypesStatus), jsonObject.status);
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
                    existingOrder.StatusModels.Add(
                        new StatusModels
                        {
                            type = status,
                            date_of_creature = DateTime.UtcNow,
                        });
                    
                    _dbContext.StatusEventsOfModels.Add(statusEvent);
                }
                await _dbContext.SaveChangesAsync();

                return Ok("Status updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{orderId}")]
        public async Task<ActionResult<OrderModels>> DeleteOrder(int orderId)
        {
            try
            {
                // Находим заказ по ID
                var order = await _dbContext.Orders.FindAsync(orderId);

                // Проверяем, существует ли заказ
                if (order == null)
                {
                    return NotFound("Order not found");
                }

                // Удаляем заказ из базы данных
                _dbContext.Orders.Remove(order);
                await _dbContext.SaveChangesAsync();

                return Ok("Order deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        public class UpdateStatusClass
        {
            public string status { get; set; }
        }
    }
}
