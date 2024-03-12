using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using netcore.console;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.ExcelImport
{
    [Authorize]
    [ApiController]
    [Route("excelimport")]
    public class ExcelImportController:ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<ExcelImportController> _logger;
        private readonly IExcelImportService _excelImportService;
        private readonly IFileService _fileService;
        private readonly IProccesService _proccesService;
        private readonly IOperationService _operationService;
        public ExcelImportController(ApplicationContext dbContext, ILogger<ExcelImportController> logger, 
            IExcelImportService excelImportService, IFileService fileService,
            IProccesService proccesService, IOperationService operationService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _excelImportService = excelImportService;
            _fileService = fileService;
            _proccesService = proccesService;
            _operationService = operationService;
        }
        [HttpPost("import")]
        public async Task<object> ImportExcelToOrder(IFormCollection form)
        {
            // Получаем файл из FormData
            IFormFile file = form.Files["file"];
            var path= await _fileService.SaveFile(file);
            var (procces, operations) = await ImportExcel.get_values_from_excel_file(path);
            var res=await _operationService.SaveProccesWithOperations(procces, operations);
            int proccesId = procces.Id;
            //procces.Operations=operations;
            return await ImportExcel.generate_procces_with_ordersDTO(procces);
        }
    }
}
