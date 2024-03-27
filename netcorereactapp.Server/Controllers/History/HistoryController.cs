using MyHistory= ClassesLibrary.Models.History;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.History.Interfaces;

namespace netcorereactapp.Server.Controllers.History
{
    [Authorize]
    [ApiController]
    [Route("history")]
    public class HistoryController:ControllerBase
    {
        private readonly IHistoryService _historyService;
        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }
        [HttpGet("{parentProccesId}")]
        public List<MyHistory> GetCurrentListHistory(int parentProccesId)
        {
            var res= _historyService.GetCurrentListHistory(parentProccesId);
            return res;
        }
    }
}
