namespace ClassesLibrary.Models
{
    public class History:Entity
    {
        public int ProccesId { get; set; }
        public Procces Procces { get; set; }
        public string Message { get; set; }
    }
}
