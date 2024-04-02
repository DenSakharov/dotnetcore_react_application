namespace ClassesLibrary.DataTransferObjects
{
    public class ProccesDTO : EntityDTO
    {
        public string? number { get; set; }
        public string? material { get; set; }
        public string? m3 { get; set; }
        public string? kd { get; set; }
        public string? profile_size { get; set; }
        public List<OperationDTO>? Operations { get; set; } = new List<OperationDTO>();
        public List<HistoryDTO>? Histories { get; set; } = new List<HistoryDTO>();
        public List<AttachmentDTO>? Attachments { get; set; } = new List<AttachmentDTO>();
    }
}
