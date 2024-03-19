using ClassesLibrary.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Controllers.Orders;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Controllers.File
{
    [Authorize]
    [ApiController]
    [Route("filedownload")]
    public class FileController : ControllerBase
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<FileController> _logger;
        private readonly IFileService _fileService;
        public FileController(ApplicationContext dbContext, ILogger<FileController> logger, IFileService fileService)
        {
            _fileService = fileService;
            _dbContext = dbContext;
            _logger = logger;
        }
        [HttpGet("{fileId}")]
        public async Task<IActionResult> DownloadAttachment(int fileId)
        {
            var attachment = await _fileService.GetCurrentAttachment(fileId) as Attachment;
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
