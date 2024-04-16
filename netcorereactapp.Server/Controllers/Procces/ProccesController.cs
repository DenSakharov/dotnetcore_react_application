using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using netcorereactapp.Server.Services.Supporting.Interfaces;

namespace netcorereactapp.Server.Controllers.ProccesController
{

    [Authorize]
    [ApiController]
    [Route("procces")]
    public class ProccesController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<ProccesController> _logger;
        private readonly IProccesService _proccesService;
        private readonly ISupportingService _supportingService;
        public ProccesController(ApplicationContext dbContext, ILogger<ProccesController> logger,
            IProccesService proccesService,
            ISupportingService supportingService
            )
        {
            _dbContext = dbContext;
            _logger = logger;
            _proccesService = proccesService;
            _supportingService = supportingService;
            //_logger.LogInformation("ProccesController is called.");
        }
        [HttpGet]
        [Route("{id}")]
        public async Task<ProccesDTO> GetCurrent(int id)
        {
            var proccesDTO = await _proccesService.GetCurrent(id);
            return proccesDTO;
        }
        [HttpGet]
        [Route("all")]
        public async Task<List<Procces>> GetAll()
        {
            return _dbContext.Procceses.OrderByDescending(proc => proc.Id).ToList();
        }
        [HttpGet]
        [Route("all/{page}/{pagesize}")]
        public async Task<IActionResult> GetSelectedProcces(int page, int pagesize)
        {
            var (procceses, totalCount) = await _proccesService.GetAll(page, pagesize);

            return Ok(new { procceses, totalCount });
        }
        [HttpPost("create")]
        public async Task<string> CreateNewProcces([FromBody] ProccesDTO procces)
        {
            var v = procces;
            var res = await _proccesService.Create(v);
            if (res != null)
            {
                var fileBytes = await _supportingService.CreateRouteMapTemplate(res);
                // Устанавливаем тип содержимого и имя файла
                string base64String = Convert.ToBase64String(fileBytes);

                return base64String;
            }
            return null;
        }
        /* [HttpPut]
         [Route("updatemodel")]
         public async Task<IActionResult> ConfirmEditedOperation(ProccesDTO editedProcces
             )
         {
             var res = await _proccesService.UpdateProcces(editedProcces);
             if (res != null)
             {
                 return Ok(res);
             }
             else
             {
                 return StatusCode(500, $"Internal server error");
             }
         }*/
        [HttpPut]
        [Route("updatemodel")]
        public async Task<IActionResult> ConfirmEditedOperation(Procces editedProcces
            )
        {
            var res = await _proccesService.UpdateProcces(editedProcces);
            if (res != null)
            {
                return Ok(res);
            }
            else
            {
                return StatusCode(500, $"Internal server error");
            }
        }
        [HttpPut]
        [Route("{proccedId}/updatefile")]
        public async Task<IActionResult> UpdateProccesesFiles(int proccedId, IFormCollection form
            )
        {
            var res = await _proccesService.AddingAttachmentsToSelectedProcces(proccedId, form.Files);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(500, "Saving files error");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _proccesService.DeleteProcces(id);
            return Ok(res);
        }
    }
}
