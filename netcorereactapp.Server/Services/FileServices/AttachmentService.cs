using ClassesLibrary.Models;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.FileServices
{
    public class AttachmentService: IAttachmentService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<AttachmentService> _logger;
        private readonly IFileService _fileService;
        public AttachmentService(ApplicationContext dbContext, ILogger<AttachmentService> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        public async Task<bool> DeleteAttachment(int id)
        {
            try
            {
                var res = await _dbContext.Attachemnts.FindAsync(id);
                _dbContext.Attachemnts.Remove(res);
                await _dbContext.SaveChangesAsync();
                await _fileService.DeleteFile(res.AttachmentData);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public AttachmentCategoryType? MapStringToAttachmentCategory(string categoryString)
        {
            switch (categoryString)
            {
                case "Инструкция":
                    return AttachmentCategoryType.Instruction;
                case "Документ":
                    return AttachmentCategoryType.Document;
                case "Модель":
                    return AttachmentCategoryType.Model;
                case "МПК":
                    return AttachmentCategoryType.MPK;
                case "Договор":
                    return AttachmentCategoryType.Agreement;
                default:
                    return null; // Если строка не соответствует ни одной категории
            }
        }
    }
}
