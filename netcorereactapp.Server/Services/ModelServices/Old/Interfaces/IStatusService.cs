using netcorereactapp.Server.Models.DataTransferObjects;

namespace netcorereactapp.Server.Services.ModelServices.Old.Interfaces
{
    public interface IStatusService
    {
        public Task<int> Add_status_to_status(int statID, string type, IFormFile file);
    }
}
