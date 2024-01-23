using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace netcorereactapp.Server.Controllers.Data
{
    [Authorize]
    [ApiController]
    [Route("data")]
    public class DataController:ControllerBase
    {
        [HttpGet]
        [Route("GetSecureData")]
        public IActionResult GetSecureData()
        {
            // Ваш код безопасного ресурса
            return Ok("Защищенные данные");
        }
        [HttpGet]
        [Authorize(Roles ="admin")]
        [Route("GetSecureDataForAdmin")]
        public IActionResult GetSecureDataForAdmin()
        {
            // Ваш код безопасного ресурса
            return Ok("Защищенные данные");
        }
    }
}
