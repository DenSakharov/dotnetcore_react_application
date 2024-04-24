using System.Text.Json.Serialization;

namespace ClassesLibrary.Models
{
    public class Procces : Entity
    {
        public string? number { get; set; }//номер
        public string? OrganizationCaption { get; set; }//Наименование организации
        public string? EquipmentType { get; set; }//Тип оборудования
        public string? EquipmentModel { get; set; }//Модель оборудования
        public List<Detail> details { get; set; } = new List<Detail>();// массив деталей
        public List<Material> materials { get; set; } = new List<Material>();//массив материалов
        public string? PartVolume { get; set; }//Объем детали
        public string? VolumeIncludingSupportingStructures { get; set; }//Объем с учетом поддерживающих структур
        public string? BuildingHeight { get; set; }//высота построения
        public string? LayerThickness { get; set; }//толщина слоя
        public string? AmountOfRequiredMaterialTakingIntoAccount { get; set; }//Количество необходимого материала с учетом КИМ
        public string? ShieldingGasVolume { get; set; }//Объем защитного газа
        public string? PrintTime { get; set; }//Время печати
        public string? LaborIntensity { get; set; }//Трудоемкость 
        public string? AdditionallyInformation { get; set; }//Дополнительная информация
        //public string? kd { get; set; }
        [JsonIgnore]
        public List<Operation> Operations { get; set; } = new List<Operation>();
        [JsonIgnore]
        public List<History> Histories { get; set; } = new List<History>();
        [JsonIgnore]
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();

       
        /*/// <summary>
        /// Номер заказа
        /// </summary>
        public string OrderNumber { get; set; }
        /// <summary>
        /// Наименование организации заказчика
        /// </summary>
        public string CustomerOrganizationName { get; set; }
        public DateTime RequestDate { get; set; }
        public string EquipmentName { get; set; }
        public string Model { get; set; }
        public string DetailName { get; set; }
        public string LocationInWorkspaceSketch { get; set; }
        public string BuildingPlatformSpecification { get; set; }
        public string Customer { get; set; }
        public string MaterialQuantityForLoading { get; set; }
        public double DetailVolumeCm3 { get; set; }
        public double VolumeWithSupportingStructuresCm3 { get; set; }
        public double BuildHeightMm { get; set; }
        public double LayerThicknessMicron { get; set; }
        public double MaterialRequiredQuantityWithCIMKg { get; set; }
        public double CompressedGasVolumeM3 { get; set; }
        public double PrintingTimeHours { get; set; }
        public double ManufacturingComplexityHours { get; set; }
        public string AdditionalInformation { get; set; }
        public string DevelopedBy { get; set; }
        public string VerifiedBy { get; set; }*/
    }
}
