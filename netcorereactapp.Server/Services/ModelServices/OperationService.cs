﻿using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;
using ClassesLibrary.Services;
using Microsoft.EntityFrameworkCore;
using netcorereactapp.Server.Services.FileServices;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using Newtonsoft.Json;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class OperationService : IOperationService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OperationService> _logger;
        private readonly IFileService _fileService;
        private readonly IAttachmentService _attachmentService;
        public OperationService(ApplicationContext dbContext, ILogger<OperationService> logger, IFileService fileService, IAttachmentService attachmentService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
            _attachmentService = attachmentService;
        }
        public async Task Get(int id)
        {
            var operation = await _dbContext.Operations.FindAsync(id);
        }
        public async Task<OperationDTO> CreateNewChildOperationForProcces(int parentId, string caption)
        {
            var existingSelectedOperation = await _dbContext.Procceses.FirstOrDefaultAsync(operation => operation.Id == parentId);
            var mapDTOoper = new OperationDTO();

            if (existingSelectedOperation != null)
            {
                var childOperation = new Operation();
                childOperation.Caption = caption;
                childOperation.DateOfCreture = DateTime.UtcNow;
                existingSelectedOperation.Operations.Add(childOperation);
                await _dbContext.SaveChangesAsync();
                mapDTOoper = MapService.MapChildOperations(new List<Operation> { childOperation }).FirstOrDefault();
            }
            return mapDTOoper;
        }
        public async Task<OperationDTO> CreateNewChildOperationForParentOperation(int parentId, string caption)
        {
            var existingSelectedOperation = await _dbContext.Operations.FirstOrDefaultAsync(operation => operation.Id == parentId);
            var mapDTOoper = new OperationDTO();

            if (existingSelectedOperation != null)
            {
                var childOperation = new Operation();
                childOperation.Caption = caption;
                childOperation.DateOfCreture = DateTime.UtcNow;
                existingSelectedOperation.ChildsOperations.Add(childOperation);
                await _dbContext.SaveChangesAsync();
                mapDTOoper = MapService.MapChildOperations(new List<Operation> { childOperation }).FirstOrDefault();
            }
            return mapDTOoper;
        }
        public async Task<OperationDTO> UpdateOperation(int operationId, IFormCollection form)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var existingSelectedOperation = _dbContext.Operations
                                                        .Include(p => p.Equipments)
                                                        .FirstOrDefault(operation => operation.Id == operationId);

                    if (existingSelectedOperation != null)
                    {
                        // Получаем статус из FormData
                        string jsonString = form["operation"];
                        Operation operation = JsonConvert.DeserializeObject<Operation>(jsonString);

                        existingSelectedOperation.Caption = operation.Caption;

                        existingSelectedOperation.laborCost = operation.laborCost;
                        existingSelectedOperation.number = operation.number;
                        existingSelectedOperation.responsibleGroup = operation.responsibleGroup;
                        existingSelectedOperation.textOper = operation.textOper;

                        /* try
                         {
                             existingSelectedOperation.Equipments = operation.Equipments;
                             await _dbContext.SaveChangesAsync();
                         }
                         catch (Exception ex) { }
 */
                        // Получаем файл из FormData
                        for (var i = 0; i < form.Files.Count; i++)
                        {
                            var path = await _fileService.SaveFile(form.Files[i]);
                            var attachment = new Attachment();
                            attachment.DateOfCreture = DateTime.UtcNow;
                            attachment.Caption = Path.GetFileNameWithoutExtension(path);
                            attachment.AttachmentData = path;
                            attachment.Category = _attachmentService.MapStringToAttachmentCategory(form[$"file_{i}_category"]);
                            _dbContext.Attachemnts.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                            existingSelectedOperation.Attachments.Add(attachment);
                            await _dbContext.SaveChangesAsync();
                        }

                        existingSelectedOperation.DateOfEdited = DateTime.UtcNow;
                        // Сохраняем изменения в базе данных
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                       
                    }
                    return MapService.MapChildOperations(new List<Operation> { existingSelectedOperation }).First();
                }
                catch (Exception ex) { return null; }
            }
            
        }
        public async Task<int> SaveProccesWithOperations(Procces procces, List<Operation> operations)
        {
            //подтверждение транзакции и в случае отмены, полный откат
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    _dbContext.Procceses.Add(procces);
                    procces.Operations = operations;
                    await _dbContext.SaveChangesAsync();
                    // Если все операции успешно добавлены, фиксируем транзакцию
                    await transaction.CommitAsync();

                    return procces.Id;
                }
                catch (Exception ex)
                {
                    // Если возникает ошибка, откатываем транзакцию
                    await transaction.RollbackAsync();
                    throw ex;
                }
            }
        }
        public async Task<OperationDTO> AddingAttachmentsToSelectedOperation(int operationId, IFormFileCollection files)
        {
            try
            {
                var existingSelectedOperation = await _dbContext.Operations.FirstOrDefaultAsync(operation => operation.Id == operationId);
                foreach (var file in files)
                {
                    if (existingSelectedOperation != null)
                    {
                        var path = await _fileService.SaveFile(file);
                        var attachment = new Attachment();
                        attachment.DateOfCreture = DateTime.UtcNow;
                        attachment.Caption = Path.GetFileNameWithoutExtension(path);
                        attachment.AttachmentData = path;
                        _dbContext.Attachemnts.Add(attachment);
                        await _dbContext.SaveChangesAsync();
                        existingSelectedOperation.Attachments.Add(attachment);
                        await _dbContext.SaveChangesAsync();
                    }
                }
                return MapService.MapChildOperations(new List<Operation> { existingSelectedOperation }).First();
            }
            catch (Exception ex) { return null; }
        }
        public async Task<bool> DeleteOperation(int id)
        {
            try
            {
                var res = await _dbContext.Operations.FindAsync(id);
                if (res != null)
                {
                    _dbContext.Operations.Remove(res);
                    await _dbContext.SaveChangesAsync();
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
