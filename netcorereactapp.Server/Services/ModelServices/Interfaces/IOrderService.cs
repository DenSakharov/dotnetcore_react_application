using netcorereactapp.Server.Models;
using netcorereactapp.Server.Models.DataTransferObjects;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IOrderService
    {
        public Task<IEnumerable<OrderDTO>> GetOrders();
        public Task<OrderModels> CreateOrder(IFormFile file, string capt);
    }
}
