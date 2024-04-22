using System.Text.Json.Serialization;

namespace ClassesLibrary.Models;

public class Material:Entity
{
    public string? LoadWeightM3 { get; set; }
    public string? ProfileAndSize { get; set; }
    public string? OrganizationCaption { get; set; }//Наименование организации
    public int? Quantity { get; set; }
    [JsonIgnore]
    public int? ProccesId { get; set; }
    [JsonIgnore]
    public Procces Procces { get; set; }
}