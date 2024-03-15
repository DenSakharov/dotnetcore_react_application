using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IOperationService
    {
        public Task<int> SaveProccesWithOperations(Procces procces, List<Operation> operations);
        public Task<OperationDTO> AddingAttachmentsToSelectedOperation(int operationId, IFormFileCollection files);
    }
}
