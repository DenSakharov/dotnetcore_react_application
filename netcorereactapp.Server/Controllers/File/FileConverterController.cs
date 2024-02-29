using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Services.FileServices;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.File
{
    [Authorize]
    [ApiController]
    [Route("converter")]
    public class FileConverterController:ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<FileConverterController> _logger;
        private readonly IFileService _fileService;
        public FileConverterController(ApplicationContext dbContext, ILogger<FileConverterController> logger, IFileService fileService)
        {
            _fileService= fileService;
            _dbContext = dbContext;
            _logger = logger;
        }
        [HttpGet("{fileId}")]
        public async Task<IActionResult> ConvertDocToPDF(int fileId)
        {
            var attachment = await _dbContext.AttachmentsOfStatuses.FirstOrDefaultAsync(a => a.Id == fileId);
            if (attachment == null)
            {
                return NotFound();
            }

            var filePath = attachment.AttachmentData; // Путь к файлу на сервере
            var resp = await _fileService.ConvertToPDF(filePath, Path.GetFileNameWithoutExtension(filePath)+".pdf");
            return Ok(resp);
        }
    }
}
