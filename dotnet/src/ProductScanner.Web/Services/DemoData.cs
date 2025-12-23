using ProductScanner.Web.Models;

namespace ProductScanner.Web.Services;

/// <summary>
/// Client-side demo data for mock scanning
/// </summary>
public static class DemoData
{
    public static readonly List<DemoProduct> Products = new()
    {
        new() { Barcode = "5449000000996", Name = "Coca-Cola Classic 330ml" },
        new() { Barcode = "4005808134915", Name = "Nivea Creme 150ml" },
        new() { Barcode = "0013000001090", Name = "Heinz Tomato Ketchup 397g" },
        new() { Barcode = "0011111181069", Name = "Dove Beauty Bar" },
        new() { Barcode = "0035000761095", Name = "Colgate Total Toothpaste" },
        new() { Barcode = "80050965", Name = "Nutella Hazelnut Spread 400g" }
    };
}
