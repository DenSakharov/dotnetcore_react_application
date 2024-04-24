using System.ComponentModel.DataAnnotations;

namespace ClassesLibrary.DataTransferObjects
{
    public class ProccesDTO : EntityDTO
    {
        public string? number { get; set; }//номер
        public string? OrganizationCaption { get; set; }//Наименование организации
        public string? EquipmentType { get; set; }//Тип оборудования
        public string? EquipmentModel { get; set; }//Модель оборудования
        public List<DetailDTO> details { get; set; } = new List<DetailDTO>();// массив деталей
        public List<MaterialDTO> materials { get; set; } = new List<MaterialDTO>();//массив материалов
        public string? PartVolume { get; set; }//Объем детали
        public string? VolumeIncludingSupportingStructures { get; set; }//Объем с учетом поддерживающих структур
        public string? BuildingHeight { get; set; }//высота построения
        public string? LayerThickness { get; set; }//толщина слоя
        public string? AmountOfRequiredMaterialTakingIntoAccount { get; set; }//Количество необходимого материала с учетом КИМ
        public string? ShieldingGasVolume { get; set; }//Объем защитного газа
        public string? PrintTime { get; set; }//Время печати
        public string? LaborIntensity { get; set; }//Трудоемкость 
        public string? AdditionallyInformation { get; set; }//Дополнительная информация
        public List<OperationDTO>? Operations { get; set; } = new List<OperationDTO>();
        public List<HistoryDTO>? Histories { get; set; } = new List<HistoryDTO>();
        public List<AttachmentDTO>? Attachments { get; set; } = new List<AttachmentDTO>();
    }
}
