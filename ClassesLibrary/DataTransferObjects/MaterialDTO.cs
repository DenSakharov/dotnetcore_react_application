namespace ClassesLibrary.DataTransferObjects;

public class MaterialDTO:EntityDTO
{
    public string? LoadWeightM3 { get; set; }
    public string? ProfileAndSize { get; set; }
    public string? OrganizationCaption { get; set; }//Наименование организации
    public int? Quantity { get; set; }
    public int? ProccesId { get; set; }
    public ProccesDTO Procces { get; set; }
}