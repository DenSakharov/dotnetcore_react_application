namespace ClassesLibrary.DataTransferObjects;

public class DetailDTO:EntityDTO
{
    public int? Quantity { get; set; }
    public int? ProccesId { get; set; }
    public ProccesDTO Procces { get; set; }
}