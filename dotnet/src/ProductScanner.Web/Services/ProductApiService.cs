using System.Net.Http.Json;
using ProductScanner.Web.Models;

namespace ProductScanner.Web.Services;

public class ProductApiService
{
    private readonly HttpClient _httpClient;

    public ProductApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<DemoStatusResponse?> GetDemoStatusAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<DemoStatusResponse>("api/demo/status");
        }
        catch
        {
            return null;
        }
    }

    public async Task<ProductLookupResponse?> LookupProductAsync(string barcode)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<ProductLookupResponse>($"api/lookup/{Uri.EscapeDataString(barcode)}");
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return new ProductLookupResponse
            {
                Success = false,
                Barcode = barcode,
                Results = new List<SearchResult>()
            };
        }
        catch
        {
            return null;
        }
    }
}
