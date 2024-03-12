using ClassesLibrary.Models;
using netcorereactapp.Server.Services.FileServices.Interfaces;
using netcorereactapp.Server.Services.ModelServices.Interfaces;
using netcorereactapp.Server.Services.PostgreService;
using System.ComponentModel.DataAnnotations;

namespace netcorereactapp.Server.Services.ModelServices
{
    public class OperationService : IOperationService
    {
        private readonly ApplicationContext _dbContext;
        private readonly ILogger<OperationService> _logger;
        private readonly IFileService _fileService;
        public OperationService(ApplicationContext dbContext, ILogger<OperationService> logger, IFileService fileService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _fileService = fileService;
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

                   /* var existingProcces = await _dbContext.Procceses.FindAsync(procces.Id);

                    if (existingProcces == null)
                    {
                        // Процесс не найден, возможно, произошла ошибка
                        throw new Exception($"Процесс с Id {procces.Id} не найден в базе данных.");
                    }
                    foreach (var operation in operations)
                    {
                        #region
                        // Проверяем валидность операции
                        var validationResults = new List<ValidationResult>();
                        var isValid = Validator.TryValidateObject(operation, new ValidationContext(operation), validationResults, validateAllProperties: true);

                        if (!isValid)
                        {
                            // Обработка ошибок валидации
                            var errorMessages = validationResults.Select(vr => vr.ErrorMessage);
                            // Возможно, вы хотите сгенерировать сообщение об ошибке или выполнить другие действия
                            throw new InvalidOperationException($"Ошибка валидации операции: {string.Join(", ", errorMessages)}");
                        }
                        #endregion
                        *//*
                        // Продолжаем добавление операции в контекст базы данных
                        var temp_operation = new Operation();
                        temp_operation.ProccesId = procces.Id;
                        temp_operation.Procces = procces;
                        temp_operation.Caption = operation.Caption;
                        //проблема с дочерними операциями и их добалвением
                        var child_operations = new List<Operation>();
                        foreach (var operationChild in operation.ChildsOperations)
                        {
                            child_operations = await test(operationChild, procces, operation);
                        }
                        temp_operation.ChildsOperations = child_operations;*/
                    /*
                        operation.ProccesId = procces.Id;
                        operation.Procces = procces;
                        foreach (var childOperation in operation.ChildsOperations)
                        {
                            await test(childOperation, procces);
                        }
                        _dbContext.Operations.Add(operation);
                        await _dbContext.SaveChangesAsync();
                    }*/

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

        async Task test(Operation oper, Procces proc)
        {
            //List<Operation> child_operations = new List<Operation>();
            if (oper.ChildsOperations.Count != 0)
            {
                foreach (var operation in oper.ChildsOperations)
                {
                    await test(operation, proc);
                }
            }

            oper.ProccesId = proc.Id; // Присваиваем процессу Id операции
            oper.Procces = proc; // Устанавливаем процесс для операции

            _dbContext.Operations.Add(oper);
            await _dbContext.SaveChangesAsync();
            //return new List<Operation> { oper }; // Возвращаем успешно сохраненную операцию
        }
    }
}
