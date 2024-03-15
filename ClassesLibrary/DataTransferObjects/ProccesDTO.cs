using System.Text.Json.Serialization;

namespace ClassesLibrary.DataTransferObjects
{
    public class ProccesDTO : EntityDTO
    {
       
        public List<OperationDTO>? Operations { get; set; } = new List<OperationDTO>();
        public List<HistoryDTO>? Histories { get; set; } = new List<HistoryDTO>();
        public List<AttachmentDTO>? Attachments { get; set; } = new List<AttachmentDTO>();
    }
}
