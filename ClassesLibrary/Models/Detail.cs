using System.Text.Json.Serialization;

namespace ClassesLibrary.Models;

public class Detail:Entity
{
    public int? Quantity { get; set; }
    [JsonIgnore]
    public int? ProccesId { get; set; }
    [JsonIgnore]
    public Procces Procces { get; set; }
}