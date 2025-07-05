using System.ComponentModel;

namespace blazor_sample.Services
{
    public class CartService : INotifyPropertyChanged
    {
        private List<CartItem> _items = new();
        
        public event PropertyChangedEventHandler? PropertyChanged;

        public IReadOnlyList<CartItem> Items => _items.AsReadOnly();

        public int TotalItems => _items.Sum(item => item.Quantity);

        public decimal TotalPrice => _items.Sum(item => item.Product.Price * item.Quantity);

        public void AddToCart(Product product, int quantity = 1)
        {
            var existingItem = _items.FirstOrDefault(item => item.Product.Id == product.Id);
            
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                _items.Add(new CartItem { Product = product, Quantity = quantity });
            }
            
            OnPropertyChanged();
        }

        public void RemoveFromCart(int productId)
        {
            var item = _items.FirstOrDefault(item => item.Product.Id == productId);
            if (item != null)
            {
                _items.Remove(item);
                OnPropertyChanged();
            }
        }

        public void UpdateQuantity(int productId, int quantity)
        {
            var item = _items.FirstOrDefault(item => item.Product.Id == productId);
            if (item != null)
            {
                if (quantity <= 0)
                {
                    RemoveFromCart(productId);
                }
                else
                {
                    item.Quantity = quantity;
                    OnPropertyChanged();
                }
            }
        }

        public void ClearCart()
        {
            _items.Clear();
            OnPropertyChanged();
        }

        private void OnPropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class CartItem
    {
        public Product Product { get; set; } = new();
        public int Quantity { get; set; }
        public decimal TotalPrice => Product.Price * Quantity;
    }

    public class Product
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Sortid { get; set; }
        public bool Display { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get; set; }
        public DateTime? Deleted_at { get; set; }
    }
}
