using ClassesLibrary.DataTransferObjects;
using ClassesLibrary.Models;

namespace netcorereactapp.Server.Services.Supporting.Interfaces
{
    public interface ISupportingService
    {
        public List<OperationDTO> ReadExcelToGetTemplateOperations( string sheetName);
        public List<EquipmentDTO> ReadExcelToGetTemplateEquipments( string sheetName);
        public Task<byte[]> CreateRouteMapTemplate(Procces procces=null);
    }
}
