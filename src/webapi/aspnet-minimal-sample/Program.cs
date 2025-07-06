using aspnet_minimal_sample.Data;
using aspnet_minimal_sample.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// MySQL データベース接続設定
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0))));

// JSON シリアライゼーション設定（スネークケース）
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// CORS設定を追加
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// CORS設定を使用（HTTPSリダイレクトより前に配置）
app.UseCors("AllowAll");

// 静的ファイル配信を有効化
app.UseStaticFiles();

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// カテゴリ API エンドポイント
app.MapGet("/mos/api/categories", async (AppDbContext db, int? display) =>
{
    var query = db.Categories.AsQueryable();
    
    if (display.HasValue)
        query = query.Where(c => c.Display == display.Value);
    
    var categories = await query.ToListAsync();
    return Results.Ok(new { items = categories, total = categories.Count });
});

app.MapPost("/mos/api/categories", async (AppDbContext db, Category category) =>
{
    db.Categories.Add(category);
    await db.SaveChangesAsync();
    return Results.Created($"/mos/api/categories/{category.Id}", category);
});

app.MapGet("/mos/api/categories/{id}", async (AppDbContext db, int id) =>
{
    var category = await db.Categories.FindAsync(id);
    return category is not null ? Results.Ok(category) : Results.NotFound();
});

app.MapPut("/mos/api/categories/{id}", async (AppDbContext db, int id, Category category) =>
{
    var existingCategory = await db.Categories.FindAsync(id);
    if (existingCategory is null) return Results.NotFound();
    
    existingCategory.Slug = category.Slug;
    existingCategory.Title = category.Title;
    existingCategory.Description = category.Description;
    existingCategory.Image = category.Image;
    existingCategory.SortId = category.SortId;
    existingCategory.Display = category.Display;
    existingCategory.UpdatedAt = DateTime.UtcNow;
    
    await db.SaveChangesAsync();
    return Results.Ok(existingCategory);
});

app.MapDelete("/mos/api/categories/{id}", async (AppDbContext db, int id) =>
{
    var category = await db.Categories.FindAsync(id);
    if (category is null) return Results.NotFound();
    
    db.Categories.Remove(category);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Products API エンドポイント
app.MapGet("/mos/api/products", async (AppDbContext db, int? display, int? category_id) =>
{
    var query = db.Products.Include(p => p.Category).AsQueryable();
    
    if (display.HasValue)
        query = query.Where(p => p.Display == display.Value);
    
    if (category_id.HasValue)
        query = query.Where(p => p.CategoryId == category_id.Value);
    
    var products = await query.ToListAsync();
    return Results.Ok(new { items = products, total = products.Count });
});

app.MapPost("/mos/api/products", async (AppDbContext db, Product product) =>
{
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/mos/api/products/{product.Id}", product);
});

app.MapGet("/mos/api/products/slug/{category_slug}", async (AppDbContext db, string category_slug, int? display) =>
{
    var category = await db.Categories.FirstOrDefaultAsync(c => c.Slug == category_slug);
    if (category is null) return Results.NotFound();
    
    var query = db.Products
        .Include(p => p.Category)
        .Where(p => p.CategoryId == category.Id);
    
    if (display.HasValue)
        query = query.Where(p => p.Display == display.Value);
    
    var products = await query.ToListAsync();
    return Results.Ok(new { items = products, total = products.Count, category });
});

app.MapGet("/mos/api/products/{id}", async (AppDbContext db, int id) =>
{
    var product = await db.Products
        .Include(p => p.Category)
        .FirstOrDefaultAsync(p => p.Id == id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});

app.MapPut("/mos/api/products/{id}", async (AppDbContext db, int id, Product product) =>
{
    var existingProduct = await db.Products.FindAsync(id);
    if (existingProduct is null) return Results.NotFound();
    
    existingProduct.CategoryId = product.CategoryId;
    existingProduct.Slug = product.Slug;
    existingProduct.Name = product.Name;
    existingProduct.Description = product.Description;
    existingProduct.Image = product.Image;
    existingProduct.Price = product.Price;
    existingProduct.SortId = product.SortId;
    existingProduct.Display = product.Display;
    existingProduct.UpdatedAt = DateTime.UtcNow;
    
    await db.SaveChangesAsync();
    return Results.Ok(existingProduct);
});

app.MapDelete("/mos/api/products/{id}", async (AppDbContext db, int id) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();
    
    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Orders API エンドポイント
app.MapGet("/mos/api/orders", async (AppDbContext db, int? status) =>
{
    var query = db.Orders.Include(o => o.OrderProducts).AsQueryable();
    
    if (status.HasValue)
        query = query.Where(o => o.Status == status.Value);
    
    return await query.ToListAsync();
});

app.MapPost("/mos/api/orders", async (AppDbContext db, OrderCreateRequest request) =>
{
    // 注文番号を自動生成
    var orderNumber = DateTime.Now.ToString("MMdd") + new Random().Next(0, 10000).ToString("D4");
    
    var order = new Order
    {
        OrderNumber = orderNumber,
        TotalPrice = request.TotalPrice,
        TotalQuantity = request.TotalQuantity,
        Status = request.Status
    };
    
    db.Orders.Add(order);
    await db.SaveChangesAsync();
    
    // 注文商品を追加
    foreach (var item in request.Items)
    {
        var orderProduct = new OrderProduct
        {
            OrderId = order.Id,
            ProductId = item.Id,
            Price = item.Price,
            Quantity = item.Quantity
        };
        db.OrderProducts.Add(orderProduct);
    }
    
    await db.SaveChangesAsync();
    
    // 作成された注文を関連データと一緒に取得
    var createdOrder = await db.Orders
        .Include(o => o.OrderProducts)
        .FirstAsync(o => o.Id == order.Id);
    
    return Results.Created($"/mos/api/orders/{order.Id}", createdOrder);
});

app.MapGet("/mos/api/orders/{id}", async (AppDbContext db, int id) =>
{
    var order = await db.Orders
        .Include(o => o.OrderProducts)
        .FirstOrDefaultAsync(o => o.Id == id);
    return order is not null ? Results.Ok(order) : Results.NotFound();
});

app.MapPut("/mos/api/orders/{id}", async (AppDbContext db, int id, Order order) =>
{
    var existingOrder = await db.Orders.FindAsync(id);
    if (existingOrder is null) return Results.NotFound();
    
    existingOrder.OrderNumber = order.OrderNumber;
    existingOrder.TotalPrice = order.TotalPrice;
    existingOrder.TotalQuantity = order.TotalQuantity;
    existingOrder.Status = order.Status;
    existingOrder.UpdatedAt = DateTime.UtcNow;
    
    await db.SaveChangesAsync();
    return Results.Ok(existingOrder);
});

app.MapDelete("/mos/api/orders/{id}", async (AppDbContext db, int id) =>
{
    var order = await db.Orders.FindAsync(id);
    if (order is null) return Results.NotFound();
    
    db.Orders.Remove(order);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
