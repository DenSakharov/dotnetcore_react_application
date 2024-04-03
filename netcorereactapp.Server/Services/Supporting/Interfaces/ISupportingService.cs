using ClassesLibrary.DataTransferObjects;

namespace netcorereactapp.Server.Services.Supporting.Interfaces
{
    public interface ISupportingService
    {
        public List<OperationDTO> ReadExcel(string filePath, string sheetName);
        public Task CreateRouteMapTemplate(string path);
    }
}
