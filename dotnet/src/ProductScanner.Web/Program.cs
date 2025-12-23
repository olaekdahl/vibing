using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ProductScanner.Web;
using ProductScanner.Web.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure API base address - defaults to localhost:5000 for development
var apiBaseAddress = builder.Configuration.GetValue<string>("ApiBaseAddress") ?? "http://localhost:5000/";

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(apiBaseAddress) });
builder.Services.AddScoped<ProductApiService>();

await builder.Build().RunAsync();
