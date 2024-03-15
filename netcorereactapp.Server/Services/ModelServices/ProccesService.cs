using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using ClassesLibrary.Services;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class ProccesService : IProccesService
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
        private void LoadChildOperationsRecursive(Operation operation)
        {
            _dbContext.Entry(operation)
                .Collection(o => o.ChildsOperations)
                .Load();

            foreach (var childOperation in operation.ChildsOperations)
            {
                LoadChildOperationsRecursive(childOperation);
            }
        }

        public async Task<ProccesDTO> GetCurrent(int id)
        {
            try
            {
                // Проверяем, существует ли операция с указанным ID в базе данных
                //var existingProcces =  _dbContext.Procceses.Where(p => p.Id == id).FirstOrDefault();

                var existingProcces = _dbContext.Procceses
                    .Include(p => p.Operations)
                    .Include(p => p.Attachments)
                    .FirstOrDefault(p => p.Id == id);

                if (existingProcces != null)
                {
                    foreach (var operation in existingProcces.Operations)
                    {
                        LoadChildOperationsRecursive(operation);
                    }
                }

                if (existingProcces == null) 
                {
                    return null; // Возвращаем 404 Not Found, если операция не найдена
                }
                var procces = new ProccesDTO();
                // Обновляем существующую операцию данными из отредактированной операции
                procces.Id = id;
                procces.Caption = existingProcces.Caption;
                procces.DateOfEdited = existingProcces.DateOfCreture ;
                procces.DateOfEdited = existingProcces.DateOfEdited ;
                //var operations = _dbContext.Operations.Where(o => o.ProccesId == existingProcces.Id).ToList();

                procces.Operations= MapService.MapChildOperations(existingProcces.Operations);
                procces.Attachments=MapService.MapAttachments(existingProcces.Attachments);
                return procces;
            }
            catch (Exception ex)
            {
                return null; // Возвращаем 500 Internal Server Error в случае ошибки
            }
        }
        public async Task<(List<Procces>, int)> GetAll(int page, int pageSize)
        {
            int totalCount = await _dbContext.Procceses.CountAsync();

            int itemsToSkip = (page - 1) * pageSize;

            List<Procces> processes = await _dbContext.Procceses
                .OrderByDescending(p => p.Id)
                .Skip(itemsToSkip)
                .Take(pageSize)
                .ToListAsync();

            return (processes, totalCount);
        }

        public async Task<Procces> UpdateProcces(ProccesDTO editedProcces)
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
        public async Task<Procces> AddingAttachmentsToSelectedProcces(int proccesId, IFormFileCollection files)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var existingSelectedProcces = await _dbContext.Procceses.FirstOrDefaultAsync(procces => procces.Id == proccesId);
                    foreach (var file in files)
                    {
                        if (existingSelectedProcces != null)
                        {
                            var path = await _fileService.SaveFile(file);
                            var attachment = new Attachemnt();
                            attachment.DateOfCreture = DateTime.UtcNow;
                            attachment.Caption = Path.GetFileNameWithoutExtension(path);
                            attachment.AttachmentData = path;
                            _dbContext.Attachemnts.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                            existingSelectedProcces.Attachments.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                        }
                    }
                    return existingSelectedProcces;
                }
                catch (Exception ex) { return null; }
            }
        }
    }
}
