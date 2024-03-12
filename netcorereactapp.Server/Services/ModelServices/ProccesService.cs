using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using ClassesLibrary.Services;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class ProccesService: IProccesService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<ProccesService> _logger;
        private readonly IFileService _fileService;
        public ProccesService(ApplicationContext dbContext, ILogger<ProccesService> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
        }
        public async Task<Procces> test(ProccesDTO editedProcces)
        {
            try
            {
                // Проверяем, существует ли операция с указанным ID в базе данных
                var existingProcces = await _dbContext.Procceses.FindAsync(editedProcces.Id);
                if (existingProcces == null)
                {
                    return null; // Возвращаем 404 Not Found, если операция не найдена
                }

                // Обновляем существующую операцию данными из отредактированной операции
                existingProcces.Caption = editedProcces.Caption;
                existingProcces.DateOfCreture = editedProcces.DateOfCreture;
                existingProcces.DateOfEdited = DateTime.UtcNow;
                existingProcces.Operations = MapService.MapChildOperations(editedProcces.Operations);
                // Сохраняем изменения в базе данных
                await _dbContext.SaveChangesAsync();

                return existingProcces; // Возвращаем 200 OK в случае успешного обновления операции
            }
            catch (Exception ex)
            {
                return null; // Возвращаем 500 Internal Server Error в случае ошибки
            }
        }
    }
}
