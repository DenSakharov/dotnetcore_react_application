using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Models.DataTransferObjects;
using netcorereactapp.Server.Services.ModelServices.Old.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.Statuses
{
    [ApiController]
    [Authorize]
    [Route("/status")]
    public class StatusController:ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<StatusController> _logger;
        private readonly IStatusService _statusService;
        public StatusController(ApplicationContext dbContext, ILogger<StatusController> logger, IStatusService statusService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _statusService = statusService;
        }
        [HttpPost("{statusId}")]
        public async Task<int> AddChildStatus(int statusId, IFormCollection form)
        {
            // Получаем статус из FormData
            string statu = form["status"];
            // Получаем файл из FormData
            IFormFile file = form.Files["file"];

            var res=await _statusService.Add_status_to_status(statusId, statu,file);
            return res;
        }
    }
}
