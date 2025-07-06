namespace aspnet_minimal_sample.Models
{
    public class OrderCreateRequest
    {
        public double TotalPrice { get; set; }
        public int TotalQuantity { get; set; }
        public int Status { get; set; } = 0;
        public List<OrderItemCreate> Items { get; set; } = new();
    }
    
    public class OrderItemCreate
    {
        public int Id { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
    }
}
