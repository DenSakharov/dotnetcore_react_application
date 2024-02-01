using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Services.PostgreService;
using Microsoft.EntityFrameworkCore;

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
        [Route("gethistory")]
        public async Task<ActionResult<IEnumerable<OrderModels>>> GetOrders()
        {
            try
            {
                var ordersWithHistory = await _dbContext.OrderStatusHistories
                    .Include(history => history.StatusEvents)
                        .ThenInclude(ev => ev.StatusModel) 
                    .ToListAsync();

                return Ok(ordersWithHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
