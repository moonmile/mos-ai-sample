using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnet_minimal_sample.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        [Column("order_number")]
        public string OrderNumber { get; set; } = string.Empty;
        
        [Column("total_price")]
        public double TotalPrice { get; set; }
        
        [Column("total_quantity")]
        public int TotalQuantity { get; set; }
        
        public int Status { get; set; } = 0;
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }
        
        // Navigation property
        public List<OrderProduct> OrderProducts { get; set; } = new();
    }
}
