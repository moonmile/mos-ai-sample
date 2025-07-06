using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspnet_minimal_sample.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Column("category_id")]
        public int? CategoryId { get; set; }
        
        public string Slug { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public double Price { get; set; }
        
        [Column("sortid")]
        public int SortId { get; set; } = 0;
        
        public int Display { get; set; } = 1;
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("deleted_at")]
        public DateTime? DeletedAt { get; set; }
        
        // Navigation property
        public Category? Category { get; set; }
    }
}
