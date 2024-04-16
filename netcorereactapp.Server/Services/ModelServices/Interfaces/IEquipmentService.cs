namespace netcorereactapp.Server.Services.ModelServices.Interfaces
{
    public interface IEquipmentService
    {
        public Task<bool> Delete(int id);
        public Task<bool> Add(int operationId, string captionEquipment);
    }
}
