using netcorereactapp.Server.Controllers.Operation;
using netcorereactapp.Server.Services.ExcelImportService.Interfaces;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.FileServices
{
    public class AttachController: IAttachmentService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<AttachController> _logger;
        public AttachController(ApplicationContext dbContext, ILogger<AttachController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }
        public async Task<bool> DeleteAttachment(int id)
        {
            try
            {
                var res=await _dbContext.Attachemnts.FindAsync(id);
                _dbContext.Attachemnts.Remove(res);
                await _dbContext.SaveChangesAsync();
                return true;
            }catch (Exception ex)
            {
                return false;
            }
        }
    }
}
