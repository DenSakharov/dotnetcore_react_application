using netcorereactapp.Server.Services.FileServices.Interfaces;
using Spire.Doc;

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
                    //+ DateTime.Now.ToString("yyyyMMddHHmmss")
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
