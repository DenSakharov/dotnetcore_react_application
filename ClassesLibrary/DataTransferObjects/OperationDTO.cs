

using System.ComponentModel.DataAnnotations;

namespace ClassesLibrary.DataTransferObjects
{
    public class OperationDTO : EntityDTO
    {
        [Required(ErrorMessage = "Поле 'Number' является обязательным.")]
        public string? number { get; set; }

        [RegularExpression(@"^\d+(\.\d+)?$", ErrorMessage = "Поле 'LaborCost' должно содержать числовое значение.")]
        public string? laborCost { get; set; }

        [StringLength(50, ErrorMessage = "Поле 'ResponsibleGroup' не должно превышать 50 символов.")]
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
