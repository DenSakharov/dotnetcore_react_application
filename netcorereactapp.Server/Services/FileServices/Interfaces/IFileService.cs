namespace netcorereactapp.Server.Services.FileServices.Interfaces
{
    public interface IFileService
    {
        public Task<object> GetCurrentAttachment(int fileId);
        public Task<string> SaveFile(IFormFile file);
        public Task<string> ConvertToPDF(string filePath, string pdfOutputPath);
        public Task<bool> DeleteFile(string filePath);
        public string GetUniqueFileName(string fileName, string fileExtension);
    }
}
