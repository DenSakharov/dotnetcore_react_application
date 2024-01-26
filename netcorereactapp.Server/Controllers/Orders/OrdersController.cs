using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.PostgreService;

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
                    // Перед добавлением в базу данных можно выполнить дополнительные проверки или логику

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
        public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] StatusModels statusUpdateModel)
        {
            try
            {
                // Проверяем, существует ли заказ с указанным ID
                var existingOrder = await GetOrder(orderId);
                if (existingOrder == null)
                {
                    return NotFound("Order not found");
                }

                // Проверяем, существует ли связанный статус
                if (existingOrder.Value.StatusModels != null)
                {
                    // Обновляем статус заказа
                    existingOrder.Value.StatusModels.type = statusUpdateModel.type;
                    await _dbContext.SaveChangesAsync(); // Сохраняем изменения в базу данных

                    return Ok("Status updated successfully");
                }
                else
                {
                    return BadRequest("StatusModels is null");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
