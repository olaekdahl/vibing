namespace ProductScanner.Api.Models;

/// <summary>
/// Demo product data structure
/// </summary>
public class DemoProduct
{
    public string Barcode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public List<SearchResult> Results { get; set; } = new();
}
