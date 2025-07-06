using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnet_minimal_sample.Models
{
    public class OrderProduct
    {
        public int Id { get; set; }
        
        [Column("order_id")]
        public int OrderId { get; set; }
        
        [Column("product_id")]
        public int ProductId { get; set; }
        
        public double Price { get; set; }
        public int Quantity { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }
    }
}
