namespace ProductScanner.Api.Models;

/// <summary>
/// Represents a single search result for a product lookup
/// </summary>
public class SearchResult
{
    public string Title { get; set; } = string.Empty;
    public string Snippet { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
}

/// <summary>
/// Response for successful product lookup
/// </summary>
public class ProductLookupResponse
{
    public bool Success { get; set; }
    public string Barcode { get; set; } = string.Empty;
    public List<SearchResult> Results { get; set; } = new();
}

/// <summary>
/// Response for health check endpoint
/// </summary>
public class HealthResponse
{
    public string Status { get; set; } = "ok";
    public string Message { get; set; } = string.Empty;
    public bool DemoMode { get; set; }
}

/// <summary>
/// Response for demo status endpoint
/// </summary>
public class DemoStatusResponse
{
    public bool DemoMode { get; set; }
    public List<string> AvailableBarcodes { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Error response model
/// </summary>
public class ErrorResponse
{
    public string Error { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
