using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.AuthenctionServices.Interfaces;
using netcorereactapp.Server.Services.AuthenctionServices;
using netcorereactapp.Server.Services.PostgreService;
using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Controllers.Data
{
    [Authorize]
    [ApiController]
    [Route("data")]
    public class DataController:ControllerBase
    {
        private readonly IPostgreService postgreService;

        public DataController(IPostgreService _postgreService)
        {
            postgreService = _postgreService;
        }
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
            List<LoginModel> data = postgreService.GetData<LoginModel>();
            return Ok(data);
        }
    }
}
