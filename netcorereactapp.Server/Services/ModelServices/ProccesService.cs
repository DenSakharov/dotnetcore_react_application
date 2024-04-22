using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using MyHistory = ClassesLibrary.Models.History;
using ClassesLibrary.Services;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using netcorereactapp.Server.Services.History.Interfaces;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class ProccesService : IProccesService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<ProccesService> _logger;
        private readonly IFileService _fileService;
        private readonly IHistoryService _historyService;
        public readonly IAttachmentService _attachmentService;
        public ProccesService(ApplicationContext dbContext,
            ILogger<ProccesService> logger, IFileService fileService,
            IHistoryService historyService, IAttachmentService attachmentService
            )
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
            _historyService = historyService;
            _attachmentService = attachmentService;
        }
        void LoadChildOperationsRecursive(Operation operation)
        {
            _dbContext.Entry(operation)
                .Collection(o => o.ChildsOperations)
                .Load();
            _dbContext.Entry(operation)
                .Collection(o => o.Attachments)
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
                    .Include(o => o.Operations)
                        .ThenInclude(o => o.Equipments)
                    .Include(p => p.Operations)
                        .ThenInclude(o => o.Attachments)
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
                var procces = MapService.GetProcces(existingProcces);
                /* new ProccesDTO();
            // Обновляем существующую операцию данными из отредактированной операции
            procces.Id = id;
            procces.Caption = existingProcces.Caption;

            procces.m3 = existingProcces.m3;
            procces.kd = existingProcces.kd;
            procces.material = existingProcces.material;
            procces.number = existingProcces.number;
            procces.profile_size = existingProcces.profile_size;

            procces.DateOfEdited = existingProcces.DateOfCreture ;
            procces.DateOfEdited = existingProcces.DateOfEdited ;
            //var operations = _dbContext.Operations.Where(o => o.ProccesId == existingProcces.Id).ToList();

            procces.Operations= MapService.MapChildOperations(existingProcces.Operations);
            procces.Attachments=MapService.MapAttachments(existingProcces.Attachments);*/
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

        public async Task<Procces> Create(ProccesDTO procces)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var newProcces = new Procces();
                    newProcces.DateOfCreture = DateTime.UtcNow;
                    newProcces.Caption = procces.Caption;

                    //newProcces.m3 = procces.m3;
                    //newProcces.kd = procces.kd;
                    //newProcces.material = procces.material;
                    newProcces.number = procces.number;
                    //newProcces.profile_size = procces.profile_size;

                    newProcces.Operations = MapService.MapChildOperations(procces.Operations);
                    _dbContext.Procceses.Add(newProcces);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return newProcces;
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
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
        public async Task<Procces> UpdateProcces(Procces editedProcces)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {

                    // Проверяем, существует ли операция с указанным ID в базе данных
                    var existingProcces = await _dbContext.Procceses.FindAsync(editedProcces.Id);
                    if (existingProcces == null)
                    {
                        return null; // Возвращаем 404 Not Found, если операция не найдена
                    }
                    /*var history = new MyHistory();
                    history.Message = $"Изменение названия проццеса с {existingProcces.Caption} на {editedProcces.Caption}";
                    history.DateOfCreture= DateTime.UtcNow;*/
                    var tempOldProcces = existingProcces;
                    // Обновляем существующую операцию данными из отредактированной операции
                    existingProcces.Caption = editedProcces.Caption;

                    //existingProcces.kd = editedProcces.kd;
                    //existingProcces.m3 = editedProcces.m3;
                    existingProcces.number = editedProcces.number;
                    //existingProcces.material = editedProcces.material;
                    //existingProcces.profile_size = editedProcces.profile_size;

                    existingProcces.DateOfCreture = editedProcces.DateOfCreture;
                    existingProcces.DateOfEdited = DateTime.UtcNow;
                    //existingProcces.Operations =editedProcces.Operations;
                    // Сохраняем изменения в базе данных
                    await _dbContext.SaveChangesAsync();

                    await _historyService.CreateNewHistory(existingProcces,
                        $"Изменение объекта {existingProcces.Caption} "
                        ); ;

                    await transaction.CommitAsync();
                    return existingProcces; // Возвращаем 200 OK в случае успешного обновления операции
                }
                catch (Exception ex)
                {
                    return null; // Возвращаем 500 Internal Server Error в случае ошибки
                }
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
                            var attachment = new Attachment();
                            attachment.DateOfCreture = DateTime.UtcNow;
                            attachment.Caption = Path.GetFileNameWithoutExtension(path);
                            attachment.AttachmentData = path;
                            _dbContext.Attachemnts.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                            existingSelectedProcces.Attachments.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                        }
                    }
                    await transaction.CommitAsync();
                    return existingSelectedProcces;
                }
                catch (Exception ex) { return null; }
            }
        }
        public async Task<Procces> AddingAttachmentsWithCategoriesToSelectedProcces(int proccesId, IFormCollection formFilesWithCategories)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var existingSelectedProcces = await _dbContext.Procceses.FirstOrDefaultAsync(procces => procces.Id == proccesId);
                    if (existingSelectedProcces != null)
                    {
                        for (var i = 0; i < formFilesWithCategories.Files.Count; i++)
                        {
                            var path = await _fileService.SaveFile(formFilesWithCategories.Files[i]);
                            var attachment = new Attachment();
                            attachment.DateOfCreture = DateTime.UtcNow;
                            attachment.Caption = Path.GetFileNameWithoutExtension(path);
                            attachment.AttachmentData = path;
                            attachment.Category= _attachmentService.MapStringToAttachmentCategory( formFilesWithCategories[$"file_{i}_category"]);
                            _dbContext.Attachemnts.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                            existingSelectedProcces.Attachments.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                        }
                        await transaction.CommitAsync();
                    }
                    return existingSelectedProcces;
                }
                catch (Exception ex) { return null; }
            }
        }
        public async Task<bool> DeleteProcces(int id)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var res = await _dbContext.Procceses.FindAsync(id);
                    if (res != null)
                    {
                        _dbContext.Procceses.Remove(res);
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return true;

                    }
                    return false;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }
    }
}
