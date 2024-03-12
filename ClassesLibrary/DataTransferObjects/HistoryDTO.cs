using ClassesLibrary.Models;

namespace ClassesLibrary.DataTransferObjects
{
    public class HistoryDTO: EntityDTO
    {
        public string Message { get; set; }
        public int ProccesId { get; set; }
        public ProccesDTO Procces { get; set; }
    }
}
