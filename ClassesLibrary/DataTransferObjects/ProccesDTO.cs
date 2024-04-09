using System.ComponentModel.DataAnnotations;

namespace ClassesLibrary.DataTransferObjects
{
    public class ProccesDTO : EntityDTO
    {
        [Required(ErrorMessage = "Поле 'Number' является обязательным.")]
        public string? number { get; set; }

        [Required(ErrorMessage = "Поле 'Material' является обязательным.")]
        public string? material { get; set; }

        [RegularExpression(@"^\d+(\.\d+)?$", ErrorMessage = "Поле 'M3' должно содержать числовое значение.")]
        public string? m3 { get; set; }

        [RegularExpression(@"^\d+(\.\d+)?$", ErrorMessage = "Поле 'Kd' должно содержать числовое значение.")]
        public string? kd { get; set; }

        [StringLength(50, ErrorMessage = "Поле 'ProfileSize' не должно превышать 50 символов.")]
        public string? profile_size { get; set; }

        public List<OperationDTO>? Operations { get; set; } = new List<OperationDTO>();
        public List<HistoryDTO>? Histories { get; set; } = new List<HistoryDTO>();
        public List<AttachmentDTO>? Attachments { get; set; } = new List<AttachmentDTO>();
    }
}
