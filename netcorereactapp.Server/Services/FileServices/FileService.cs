using netcorereactapp.Server.Services.FileServices.Interfaces;

namespace netcorereactapp.Server.Services.FileServices
{
    public class FileService: IFileService
    {
        private readonly string path_to_files = "C:\\Uploads";
        public async Task< string> SaveFile(IFormFile file) {
            string temp_file_name = "";
            if (file != null && file.Length > 0)
            {
                // Генерируем уникальное имя файла
                var fileName = Path.GetFileNameWithoutExtension(file.FileName)
                    + DateTime.Now.ToString("yyyyMMddHHmmss")
                + Path.GetExtension(file.FileName);
                temp_file_name = Path.Combine(path_to_files, fileName);

                // Сохраняем файл на диск
                using (var stream = new FileStream(temp_file_name, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            return temp_file_name;
        }
    }
}
