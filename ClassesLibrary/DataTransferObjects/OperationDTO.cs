

namespace ClassesLibrary.DataTransferObjects
{
    public class OperationDTO : EntityDTO
    {
        public string? number { get; set; }
        public string? laborCost { get; set; }
        public string? responsibleGroup { get; set; }
        public List<EquipmentDTO>? Equipments { get; set; }
            = new List<EquipmentDTO>();
        public int? ProccesId { get; set; }
        public ProccesDTO? Procces { get; set; }
        public int? ParentOperationId { get; set; }
        public OperationDTO? ParentOperation { get; set; }  
        public List<OperationDTO>? ChildsOperations { get; set; } 
            = new List<OperationDTO>();
        public List<AttachmentDTO>? Attachments { get; set; }
            = new List<AttachmentDTO>();
    }
}
