using ClassesLibrary.Models;
namespace ClassesLibrary.DataTransferObjects
{
    public class EquipmentDTO:EntityDTO
    {
        public int? OperationId { get; set; }
        public Operation? Operation { get; set; }
    }
}
