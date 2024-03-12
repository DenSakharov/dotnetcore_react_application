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
            _logger.LogInformation("ProccesController is called.");
        }
        [HttpPut]
        [Route("updatemodel")]
        public async Task<IActionResult> ConfirmEditedOperation( ProccesDTO editedProcces
            )
        {
            
            var res = await _proccesService.test(editedProcces);
            if (res != null)
            {
                return Ok(res);
            }
            else
            {
                return StatusCode(500, $"Internal server error");
            }
        }
    }
    public class ProccesViewModel
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreation { get; set; }
        public DateTime DateOfEdited { get; set; }
        public List<OperationViewModel>? Operations { get; set; } = new List<OperationViewModel>();
        public List<HistoryViewModel>? Histories { get; set; } = new List<HistoryViewModel>();
    }

    public class OperationViewModel
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreation { get; set; }
        public DateTime DateOfEdited { get; set; }
        public List<AttachmentViewModel>? Attachments { get; set; }= new List<AttachmentViewModel>();
        public int? ParentOperationId { get; set; }
        public List<OperationViewModel>? ChildsOperations { get; set; }=new List<OperationViewModel>();
    }

    public class AttachmentViewModel
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreation { get; set; }
        public DateTime DateOfEdited { get; set; }
        public string AttachmentData { get; set; }
    }

    public class HistoryViewModel
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public DateTime DateOfCreation { get; set; }
        public DateTime DateOfEdited { get; set; }
        public string Message { get; set; }
    }
}
