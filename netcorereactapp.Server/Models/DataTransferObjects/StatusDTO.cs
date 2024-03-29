﻿using netcorereactapp.Server.Models;

namespace netcorereactapp.Server.Models.DataTransferObjects
{
    public class StatusDTO
    {
        // Свойства модели статуса
        public int Id { get; set; }
        public TypesStatus Type { get; set; }
        public DateTime DateOfCreature { get; set; }
        public int? ParentId { get; set; }
        public List<AttachmentDTO> Attachments { get; set; } = new List<AttachmentDTO>();
        public List<StatusDTO> ChildStatuses { get; set; } = new List<StatusDTO>();
    }
}
