using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices;
using netcorereactapp.Server.Services.PostgreService;
using Spire.Doc;

namespace netcorereactapp.Server.Services.FileServices
{
    public class FileService: IFileService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<FileService> _logger;
        private readonly IConfiguration _configuration;
        public FileService(ApplicationContext dbContext, ILogger<FileService> logger,
            IConfiguration configuration)
        {
            _configuration = configuration;
            path_to_files = _configuration["Configuration:fileDirectoryPath"];
            _dbContext = dbContext;
            _logger = logger;
        }
        private readonly string path_to_files ;
        //"C:\\Uploads";
        public async Task<object> GetCurrentAttachment(int fileId)
        {
            var attachment = await _dbContext.Attachemnts.FirstOrDefaultAsync(a => a.Id == fileId);
            if (attachment == null)
            {
                var attachmentOld = await _dbContext.AttachmentsOfStatuses.FirstOrDefaultAsync(a => a.Id == fileId);
                if (attachmentOld == null)
                {
                    return null;
                }
                return attachmentOld;
            }
            return attachment;
        }
        public async Task<string> SaveFile(IFormFile file)
        {
            string temp_file_name = "";
            if (file != null && file.Length > 0)
            {
                // Генерируем уникальное имя файла
                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                var fileExtension = Path.GetExtension(file.FileName);
                //предполагает дублирование имен файла в общей
                var uniqueFileName = GetUniqueFileName(fileName, fileExtension);
                temp_file_name = Path.Combine(path_to_files, uniqueFileName);

                // Сохраняем файл на диск
                using (var stream = new FileStream(temp_file_name, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            return temp_file_name;
        }

        public string GetUniqueFileName(string fileName, string fileExtension)
        {
            var uniqueFileName = fileName;
            int count = 1;

            // Проверяем, существует ли файл с таким именем
            while (File.Exists(Path.Combine(path_to_files, uniqueFileName + fileExtension)))
            {
                uniqueFileName = $"{fileName} ({count})";
                count++;
            }

            return uniqueFileName + fileExtension;
        }

        public async Task<bool> DeleteFile(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true; // Файл успешно удален
                }
                else
                {
                    return false; // Файл не найден
                }
            }
            catch (Exception ex)
            {
                // Обработка ошибок при удалении файла
                return false;
            }
        }
        public async Task<string> ConvertToPDF(string filePath, string pdfOutputPath)
        {
            // Загрузка документа Word
            Document doc = new Document();
            doc.LoadFromFile(filePath);

            // Создание потока для сохранения PDF
            using (MemoryStream pdfStream = new MemoryStream())
            {
                // Сохранение документа Word в PDF
                doc.SaveToStream(pdfStream, FileFormat.PDF);

                // Перемещение указателя потока в начало
                pdfStream.Seek(0, SeekOrigin.Begin);

                // Чтение содержимого потока в виде массива байтов
                byte[] pdfBytes = pdfStream.ToArray();

                // Преобразовать байтовый массив в строку base64
                string base64String = Convert.ToBase64String(pdfBytes);

               /* using (FileStream fileStream = new FileStream(pdfOutputPath, FileMode.Create, FileAccess.Write))
                {
                    pdfStream.CopyTo(fileStream);
                    Console.WriteLine("\n!!!\nFile saved -> "+ pdfOutputPath + "\n!!!\n");
                }*/
                return base64String;
            }
        }
    }
}
