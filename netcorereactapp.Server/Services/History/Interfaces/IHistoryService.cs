using ClassesLibrary.Models;
using MyHistory = ClassesLibrary.Models.History;

namespace netcorereactapp.Server.Services.History.Interfaces
{
    public interface IHistoryService
    {
        public Task<MyHistory> GetCurrentHistoryAsync(int id);
        public List<MyHistory> GetCurrentListHistory(int proccesId);
        public Task<int> CreateNewHistory(Procces procces, string message);
    }
}
