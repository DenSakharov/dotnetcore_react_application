namespace netcorereactapp.Server.Services.FileServices.Interfaces
{
    public interface IFileService
    {
        public Task<string> SaveFile(IFormFile file);
        public Task<string> ConvertToPDF(string filePath, string pdfOutputPath);
    }
}
