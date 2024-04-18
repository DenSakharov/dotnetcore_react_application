using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.Operation
{
    [Authorize]
    [ApiController]
    [Route("operation")]
    public class OperationController:ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OperationController> _logger;
        private readonly IOperationService _operationService;
        public OperationController(ApplicationContext dbContext, ILogger<OperationController> logger,
            IOperationService operationService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _operationService = operationService;
            //_logger.LogInformation("OperationController is called.");
        }
        [HttpGet]
        [Route("{operationId}")]
        public async Task<IActionResult> GetCurrentOperation(int operationId)
        {
            /*var res = await _operationService.AddingAttachmentsToSelectedOperation(operationId, form.Files);
            if (res != null)
            {
                return Ok(res);
            }*/
            return StatusCode(500, "Saving files error");
        }
        [HttpPut("{operationId}")]
        public async Task<IActionResult> UpdateOperation(int operationId, IFormCollection form)
        {
            var res=await _operationService.UpdateOperation(operationId, form);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(500, "Saving files error");
        }
        [HttpPut]
        [Route("{operationId}/updatefile")]
        public async Task<IActionResult> UpdateOperationsFiles(int operationId, IFormCollection form
           )
        {
            var res = await _operationService.AddingAttachmentsToSelectedOperation(operationId, form.Files);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(500, "Saving files error");
        }
        [HttpPost("{parentId}/operation")]
        public async Task<IActionResult> AddChildOperationToParrentOperation(int parentId, [FromBody] string captionChildOperartion)
        {
            var res = await _operationService.CreateNewChildOperationForParentOperation(parentId, captionChildOperartion);
            return Ok(res);
        }
        [HttpPost("{parentId}/procces")]
        public async Task<IActionResult> AddChildOperationToProcces(int parentId, [FromBody] string captionChildOperartion)
        {
            var res = await _operationService.CreateNewChildOperationForProcces(parentId, captionChildOperartion);
            return Ok(res);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await _operationService.DeleteOperation(id);
            return Ok(res);
        }
    }
}
