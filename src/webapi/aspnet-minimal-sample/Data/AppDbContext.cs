using aspnet_minimal_sample.Models;
using Microsoft.EntityFrameworkCore;

namespace aspnet_minimal_sample.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderProduct> OrderProducts { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // テーブル名を明示的に指定
            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<OrderProduct>().ToTable("order_products");
        }
    }
}
