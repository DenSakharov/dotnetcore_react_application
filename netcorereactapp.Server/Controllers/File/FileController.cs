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

            // Чтение содержимого файла в виде массива байтов
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);

            // Преобразовать байтовый массив в строку base64
            string base64String = Convert.ToBase64String(fileBytes);

            // Возвращение строки base64 в качестве ответа
            return Ok( base64String );
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
