using System.Text.Json;
using ProductScanner.Api.Demo;
using ProductScanner.Api.Models;

namespace ProductScanner.Api.Services;

/// <summary>
/// Service for looking up products via Google Custom Search API or demo fixtures
/// </summary>
public class ProductLookupService : IProductLookupService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ProductLookupService> _logger;
    private readonly bool _demoMode;

    public ProductLookupService(
        IConfiguration configuration, 
        HttpClient httpClient,
        ILogger<ProductLookupService> logger)
    {
        _configuration = configuration;
        _httpClient = httpClient;
        _logger = logger;
        _demoMode = configuration.GetValue<bool>("DemoMode");
    }

    public async Task<ProductLookupResponse> LookupProductAsync(string barcode)
    {
        // Demo mode - return mock data
        if (_demoMode)
        {
            _logger.LogInformation("[DEMO MODE] Looking up barcode: {Barcode}", barcode);
            
            // Simulate network delay (300-800ms)
            var delay = Random.Shared.Next(300, 800);
            await Task.Delay(delay);
            
            var result = DemoFixtures.GetDemoProduct(barcode);
            _logger.LogInformation("[DEMO MODE] Returning mock results for: {Barcode}", barcode);
            
            return result;
        }

        // Production mode - call Google API
        return await CallGoogleSearchApiAsync(barcode);
    }

    private async Task<ProductLookupResponse> CallGoogleSearchApiAsync(string barcode)
    {
        var apiKey = _configuration["GoogleApi:ApiKey"];
        var cx = _configuration["GoogleApi:Cx"];
        var resultsLimit = _configuration.GetValue<int>("GoogleApi:ResultsLimit", 3);

        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(cx))
        {
            throw new InvalidOperationException(
                "Google API credentials are not configured. Please set GoogleApi:ApiKey and GoogleApi:Cx, or enable DemoMode=true for testing.");
        }

        var searchQuery = $"{barcode} food cosmetic product";
        var url = $"https://www.googleapis.com/customsearch/v1?key={apiKey}&cx={cx}&q={Uri.EscapeDataString(searchQuery)}&num={resultsLimit}";

        _logger.LogInformation("Calling Google Custom Search API for barcode: {Barcode}", barcode);

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var searchResponse = JsonSerializer.Deserialize<GoogleSearchResponse>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (searchResponse?.Items == null || searchResponse.Items.Count == 0)
        {
            return new ProductLookupResponse
            {
                Success = false,
                Barcode = barcode,
                Results = new List<SearchResult>()
            };
        }

        return new ProductLookupResponse
        {
            Success = true,
            Barcode = barcode,
            Results = searchResponse.Items.Select(item => new SearchResult
            {
                Title = item.Title ?? string.Empty,
                Snippet = item.Snippet ?? string.Empty,
                Link = item.Link ?? string.Empty
            }).ToList()
        };
    }
}

// Google Search API response models
public class GoogleSearchResponse
{
    public List<GoogleSearchItem>? Items { get; set; }
}

public class GoogleSearchItem
{
    public string? Title { get; set; }
    public string? Snippet { get; set; }
    public string? Link { get; set; }
}
