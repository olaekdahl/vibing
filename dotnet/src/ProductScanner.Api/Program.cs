using ProductScanner.Api.Demo;
using ProductScanner.Api.Models;
using ProductScanner.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();
builder.Services.AddHttpClient<IProductLookupService, ProductLookupService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

var demoMode = app.Configuration.GetValue<bool>("DemoMode");

// Health check endpoint
app.MapGet("/api/health", () => new HealthResponse
{
    Status = "ok",
    Message = "Server is running",
    DemoMode = demoMode
}).WithName("HealthCheck").WithTags("Health");

// Demo status endpoint
app.MapGet("/api/demo/status", () => new DemoStatusResponse
{
    DemoMode = demoMode,
    AvailableBarcodes = demoMode ? DemoFixtures.BarcodeList : new List<string>(),
    Message = demoMode 
        ? "Demo mode is active. No real API calls will be made."
        : "Demo mode is disabled. Real Google API calls will be made."
}).WithName("DemoStatus").WithTags("Demo");

// Product lookup endpoint
app.MapGet("/api/lookup/{barcode}", async (string barcode, IProductLookupService lookupService) =>
{
    if (string.IsNullOrWhiteSpace(barcode))
    {
        return Results.BadRequest(new ErrorResponse
        {
            Error = "Invalid barcode",
            Message = "Barcode parameter is required"
        });
    }

    try
    {
        var result = await lookupService.LookupProductAsync(barcode);
        
        if (!result.Success && result.Results.Count == 0)
        {
            return Results.NotFound(new ErrorResponse
            {
                Error = "Not found",
                Message = $"No products found for barcode: {barcode}"
            });
        }
        
        return Results.Ok(result);
    }
    catch (InvalidOperationException ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Configuration error"
        );
    }
    catch (HttpRequestException ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 502,
            title: "Google API error"
        );
    }
}).WithName("LookupProduct").WithTags("Products");

// Log startup info
app.Logger.LogInformation("Server is running on port {Port}", 
    app.Configuration.GetValue<int>("Port", 5000));
app.Logger.LogInformation("Demo mode: {DemoMode}", demoMode ? "ENABLED" : "DISABLED");

if (demoMode)
{
    app.Logger.LogInformation("Available demo barcodes: {Barcodes}", 
        string.Join(", ", DemoFixtures.BarcodeList));
}

app.Run();

