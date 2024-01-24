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

    }
}
