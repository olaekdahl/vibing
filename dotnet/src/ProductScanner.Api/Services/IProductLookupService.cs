using ProductScanner.Api.Models;

namespace ProductScanner.Api.Services;

/// <summary>
/// Interface for product lookup service
/// </summary>
public interface IProductLookupService
{
    Task<ProductLookupResponse> LookupProductAsync(string barcode);
}
