using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using System.Linq;
using System.Text.Json;

namespace netcorereactapp.Server.Controllers.Orders
{
    [Route("orders")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrdersController> _logger;
        private readonly IOrderService _orderService;
        public OrdersController(ApplicationContext dbContext, ILogger<OrdersController> logger, IOrderService orderService)
        {
            try
            {
                _dbContext = dbContext;
                _logger = logger;
                _orderService = orderService;
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
                var orders = await _orderService.GetOrders();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
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
                    var result = await _orderService.CreateOrder(file, capt );
                    if (result != null)
                    {
                        return Ok();
                    }
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
