using System.Text.Json.Serialization;

namespace ClassesLibrary.DataTransferObjects
{
    public class OperationDTO : EntityDTO
    {
        public int ProccesId { get; set; }
        public ProccesDTO? Procces { get; set; }
        public int? ParentOperationId { get; set; }
        public OperationDTO? ParentOperation { get; set; }  
        public List<OperationDTO>? ChildsOperations { get; set; } 
            = new List<OperationDTO>();
        public List<AttachmentDTO>? Attachments { get; set; }
            = new List<AttachmentDTO>();
    }
}
