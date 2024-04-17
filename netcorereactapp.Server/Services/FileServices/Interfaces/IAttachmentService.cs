using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.FileServices.Interfaces
{
    public interface IAttachmentService
    {
        public Task<bool> DeleteAttachment(int id);
        public AttachmentCategoryType? MapStringToAttachmentCategory(string categoryString);
    }
}
