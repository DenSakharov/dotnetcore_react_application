using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.PostgreService;
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

        public OrdersController(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("getorders")]
        public async Task<ActionResult<IEnumerable<OrderModels>>> GetOrders()
        {
            try
            {
                var orders = await _dbContext.Orders
                    .Include(o => o.StatusModels) // Включаем связанный статус
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("createorder")]
        public async Task<ActionResult<OrderModels>> CreateOrder([FromBody] OrderModels order)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _dbContext.Orders.Add(order);
                    await _dbContext.SaveChangesAsync();

                    return Ok(order);
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
            if (!Enum.TryParse<TypesStatus>(jsonObject.status, out TypesStatus status))
            {
                return BadRequest("Invalid status value");
            }

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

                if (existingOrder.StatusModels == null)
                {
                    existingOrder.StatusModels = new StatusModels(); 
                }

                existingOrder.StatusModels.type = status;
                existingOrder.StatusModels.date_of_creature = DateTime.UtcNow;
                existingOrder.date_of_edited = DateTime.UtcNow;
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
