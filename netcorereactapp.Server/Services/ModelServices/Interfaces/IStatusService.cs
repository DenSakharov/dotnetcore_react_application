using netcorereactapp.Server.Models.DataTransferObjects;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IStatusService
    {
        public Task<int> Add_status_to_status(int statID, string type, IFormFile file);
    }
}
