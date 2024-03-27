using ClassesLibrary.Models;
using netcorereactapp.Server.Controllers.History;
using netcorereactapp.Server.Services.History.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using MyHistory=ClassesLibrary.Models.History;

namespace netcorereactapp.Server.Services.History
{
    public class HistoryService: IHistoryService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<HistoryController> _logger;
        public HistoryService(ApplicationContext dbContext, ILogger<HistoryController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }
        public async Task<MyHistory> GetCurrentHistoryAsync(int id)
        {
            var res = await _dbContext.Histories.FindAsync(id) as ClassesLibrary.Models.History;
            return res;
        }
        public List<MyHistory> GetCurrentListHistory(int proccesId)
        {
            var res = _dbContext.Histories
                               .Where(history => history.ProccesId == proccesId).ToList();
            return res;
        }
        public async Task<int> CreateNewHistory(Procces procces,string message)
        {
            try
            {
                var history = new MyHistory();
                history.Message = message;
                history.DateOfCreture = DateTime.UtcNow;
                history.Caption = $"История объекта {procces.Caption} под номером {procces.Id}";
                procces.Histories.Add(history);
                _dbContext.Histories.Add(history);
                await _dbContext.SaveChangesAsync();
                return history.Id;
            } catch (Exception ex)
            {
                return 0;
            }
        }
    }
}
