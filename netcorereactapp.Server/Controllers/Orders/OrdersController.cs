using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
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
                    var result = await _orderService.CreateOrder(file, capt);
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
        public async Task<ActionResult> GetOrder(int orderId)
        {
            var order = await _orderService.GetOrder(orderId);
            if (order == null)
            {
                return NotFound(); // Возвращаем 404 Not Found, если заказ не найден
            }

            return Ok(order); // Возвращаем заказ в случае успеха
        }
        [HttpPut("{orderId}/updatestatus")]
        public async Task<IActionResult> UpdateStatus(int orderId, IFormCollection form)
        {
            // Получаем статус из FormData
            string statu = form["status"];

            // Получаем файл из FormData
            IFormFile file = form.Files["file"];

            var res=await _orderService.UpdateStatus(orderId, statu, file);

            return Ok($"Status updated successfully {res}");
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

    }
}
