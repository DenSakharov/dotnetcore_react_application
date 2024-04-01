using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ExcelImportService
{
    public class ExcelImportService:IExcelImportService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<StatusService> _logger;
        private readonly IFileService _fileService;
        public ExcelImportService(ApplicationContext dbContext, ILogger<StatusService> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
       /* public void inport_excel()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }*/
    }
}
