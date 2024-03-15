using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Controllers.ExcelImport;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.ProccesController
{
    [Authorize]
    [ApiController]
    [Route("procces")]
    public class ProccesController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<ProccesController> _logger;
        private readonly IExcelImportService _excelImportService;
        private readonly IFileService _fileService;
        private readonly IProccesService _proccesService;
        private readonly IOperationService _operationService;
        public ProccesController(ApplicationContext dbContext, ILogger<ProccesController> logger,
            IExcelImportService excelImportService, IFileService fileService,
            IProccesService proccesService, IOperationService operationService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _excelImportService = excelImportService;
            _fileService = fileService;
            _proccesService = proccesService;
            _operationService = operationService;
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
            return _dbContext.Procceses.OrderByDescending(proc=>proc.Id).ToList();
        }
        [HttpGet]
        [Route("all/{page}/{pagesize}")]
        public async  Task<IActionResult> GetSelectedProcces(int page,int pagesize)
        {
            var (procceses, totalCount) = await _proccesService.GetAll(page, pagesize);

            return Ok(new { procceses, totalCount });
        }
        [HttpPut]
        [Route("updatemodel")]
        public async Task<IActionResult> ConfirmEditedOperation( ProccesDTO editedProcces
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
            var res=await _proccesService.AddingAttachmentsToSelectedProcces(proccedId,form.Files);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(500, "Saving files error");
        }
    }
}
