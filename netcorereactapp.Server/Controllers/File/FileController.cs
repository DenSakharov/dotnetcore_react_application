using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.File
{
    [Authorize]
    [ApiController]
    [Route("filedownload")]
    public class FileController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OrdersController> _logger;
        public FileController(ApplicationContext dbContext, ILogger<OrdersController> logger)
        {
            try
            {
                _dbContext = dbContext;
                _logger = logger;
                //logger.LogInformation("FileController constructor called.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
        [HttpGet("{fileId}")]
        public async Task<IActionResult> DownloadAttachment(int fileId)
        {
            var attachment = await _dbContext.AttachmentsOfStatuses.FirstOrDefaultAsync(a => a.Id == fileId);
            if (attachment == null)
            {
                return NotFound();
            }

            var filePath = attachment.AttachmentData; // Путь к файлу на сервере
            var fileName = Path.GetFileNameWithoutExtension( 
                attachment.AttachmentData); // Имя файла

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, GetContentType(filePath), fileName);
        }
        private string GetContentType(string filePath)
        {
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filePath, out string contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }
    }
}
