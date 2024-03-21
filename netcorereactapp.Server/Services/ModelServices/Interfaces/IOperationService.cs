using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IOperationService
    {
        public Task<OperationDTO> CreateNewChildOperationForParentOperation(int parentId, string caption);
        public Task<OperationDTO> UpdateOperation(int operationId, IFormCollection form);
        public Task<int> SaveProccesWithOperations(Procces procces, List<Operation> operations);
        public Task<OperationDTO> AddingAttachmentsToSelectedOperation(int operationId, IFormFileCollection files);
    }
}
