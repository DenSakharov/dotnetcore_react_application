using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.PostgreService;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace netcorereactapp.Server.Controllers.History
{
    [Route("history")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class HistoryController:ControllerBase
    {
        private readonly ApplicationContext _dbContext;

        public HistoryController(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("{orderId}")]
        public async Task<ActionResult<IEnumerable<OrderStatusHistory>>> GetOrdersWithHistory(int orderId)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                var ordersWithHistory = await _dbContext.OrderStatusHistories
                    .Include(history => history.Order)
                    .Include(history => history.StatusEvents)
                        .ThenInclude(ev => ev.StatusModel)
                    .Where(history => history.OrderId == orderId)
                    .ToListAsync();

                var ordersWithHistoryDTO = ordersWithHistory.Select(history =>
                {
                    Console.WriteLine($"Order ID: {history.Order.id}");

                    foreach (var statusEvent in history.StatusEvents)
                    {
                        Console.WriteLine($"Status Event ID: {statusEvent.Id}");
                        Console.WriteLine($"Status Model ID: {statusEvent.StatusModel.id}");
                        // Добавьте другие свойства для вывода, если необходимо
                    }

                    return new OrderStatusHistory
                    {
                        Id = history.Order.id,
                        StatusEvents = history.StatusEvents
                    };
                }).ToList();

                return Ok(ordersWithHistoryDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
