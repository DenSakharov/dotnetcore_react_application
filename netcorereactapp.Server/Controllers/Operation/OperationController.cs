using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices.Interfaces;
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
        private readonly IExcelImportService _excelImportService;
        private readonly IFileService _fileService;
        private readonly IProccesService _proccesService;
        private readonly IOperationService _operationService;
        public OperationController(ApplicationContext dbContext, ILogger<OperationController> logger,
            IExcelImportService excelImportService, IFileService fileService,
            IProccesService proccesService, IOperationService operationService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _excelImportService = excelImportService;
            _fileService = fileService;
            _proccesService = proccesService;
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
    }
}
