using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IProccesService
    {
        public Task<Procces> test(ProccesDTO editedProcces);
    }
}
