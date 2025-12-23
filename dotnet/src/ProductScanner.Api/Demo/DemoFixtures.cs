using ProductScanner.Api.Models;

namespace ProductScanner.Api.Demo;

/// <summary>
/// Static demo fixtures for mock product data
/// </summary>
public static class DemoFixtures
{
    public static readonly Dictionary<string, DemoProduct> Products = new()
    {
        // Coca-Cola
        ["5449000000996"] = new DemoProduct
        {
            Barcode = "5449000000996",
            Name = "Coca-Cola",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "Coca-Cola Classic 330ml - Official Product Information",
                    Snippet = "Coca-Cola Classic is a carbonated soft drink manufactured by The Coca-Cola Company. Original taste, refreshing and delicious. Contains: Carbonated Water, Sugar, Colour (Caramel E150d), Phosphoric Acid, Natural Flavourings Including Caffeine.",
                    Link = "https://www.coca-cola.com/products/coca-cola-classic"
                },
                new()
                {
                    Title = "Coca-Cola Nutrition Facts and Ingredients | Walmart",
                    Snippet = "Coca-Cola Classic 330ml can. Serving Size: 330ml. Calories: 139. Total Fat: 0g. Sodium: 10mg. Total Carbohydrates: 35g. Sugars: 35g. Protein: 0g.",
                    Link = "https://www.walmart.com/ip/coca-cola-classic"
                },
                new()
                {
                    Title = "Coca-Cola Original Taste | Amazon.com",
                    Snippet = "Buy Coca-Cola Original Taste online. Pack of 24 cans. Perfect for parties, gatherings, or everyday refreshment. Same great taste since 1886.",
                    Link = "https://www.amazon.com/Coca-Cola-Original-Taste"
                }
            }
        },

        // Nivea Cream
        ["4005808134915"] = new DemoProduct
        {
            Barcode = "4005808134915",
            Name = "Nivea Creme",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "NIVEA Creme 150ml - Moisturizing Cream | Official NIVEA",
                    Snippet = "NIVEA Creme is the iconic multi-purpose moisturizing cream. The trusted formula enriched with Eucerit has been caring for skin since 1911. Suitable for face, body, and hands.",
                    Link = "https://www.nivea.com/products/nivea-creme"
                },
                new()
                {
                    Title = "NIVEA Creme Ingredients and Safety Information",
                    Snippet = "Ingredients: Aqua, Paraffinum Liquidum, Cera Microcristallina, Glycerin, Lanolin Alcohol (Eucerit), Paraffin, Panthenol, Decyl Oleate, Octyldodecanol, Aluminum Stearates.",
                    Link = "https://www.nivea.com/products/nivea-creme/ingredients"
                },
                new()
                {
                    Title = "NIVEA Creme Reviews and Ratings | Sephora",
                    Snippet = "Read 1,500+ reviews for NIVEA Creme. Average rating: 4.7/5 stars. Customers love the rich, moisturizing formula and classic scent. Great value for money.",
                    Link = "https://www.sephora.com/nivea-creme"
                }
            }
        },

        // Heinz Ketchup
        ["0013000001090"] = new DemoProduct
        {
            Barcode = "0013000001090",
            Name = "Heinz Tomato Ketchup",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "Heinz Tomato Ketchup 397g | Official Heinz Products",
                    Snippet = "Heinz Tomato Ketchup is made with vine-ripened tomatoes for a thick, rich taste. No artificial colors, flavors, or preservatives. The world's favorite ketchup since 1876.",
                    Link = "https://www.heinz.com/products/heinz-tomato-ketchup"
                },
                new()
                {
                    Title = "Heinz Ketchup Nutrition Facts | FoodData Central",
                    Snippet = "Serving size: 1 tbsp (17g). Calories: 20. Total Fat: 0g. Sodium: 160mg. Total Carbohydrates: 5g. Sugars: 4g. Contains tomato concentrate, distilled vinegar, high fructose corn syrup, salt, spices.",
                    Link = "https://fdc.nal.usda.gov/heinz-ketchup"
                },
                new()
                {
                    Title = "Heinz Tomato Ketchup - Buy Online | Target",
                    Snippet = "Shop Heinz Tomato Ketchup in various sizes. Available in squeeze bottles and glass bottles. Free shipping on orders over $35. Same day delivery available.",
                    Link = "https://www.target.com/heinz-ketchup"
                }
            }
        },

        // Dove Soap
        ["0011111181069"] = new DemoProduct
        {
            Barcode = "0011111181069",
            Name = "Dove Beauty Bar",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "Dove Beauty Bar Original - Gentle Cleansing | Dove",
                    Snippet = "Dove Beauty Bar is a #1 dermatologist recommended brand. Contains 1/4 moisturizing cream for softer, smoother skin. Mild and gentle formula suitable for daily use.",
                    Link = "https://www.dove.com/products/beauty-bar"
                },
                new()
                {
                    Title = "Dove Original Beauty Bar Ingredients",
                    Snippet = "Sodium Lauroyl Isethionate, Stearic Acid, Sodium Tallowate, Water, Sodium Isethionate, Coconut Acid, Sodium Stearate, Cocamidopropyl Betaine, Sodium Cocoate.",
                    Link = "https://www.dove.com/products/beauty-bar/ingredients"
                },
                new()
                {
                    Title = "Dove Beauty Bar 4-Pack | Walgreens",
                    Snippet = "Buy Dove Beauty Bar Original at Walgreens. 4 bars per pack. Dermatologist recommended for sensitive skin. Hypoallergenic and fragrance-free options available.",
                    Link = "https://www.walgreens.com/dove-beauty-bar"
                }
            }
        },

        // Colgate Toothpaste
        ["0035000761095"] = new DemoProduct
        {
            Barcode = "0035000761095",
            Name = "Colgate Total Toothpaste",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "Colgate Total Whitening Toothpaste | Colgate",
                    Snippet = "Colgate Total Whitening Toothpaste fights bacteria on teeth, tongue, cheeks, and gums for 12-hour protection. Whitens teeth and prevents cavities, gingivitis, and bad breath.",
                    Link = "https://www.colgate.com/products/colgate-total-whitening"
                },
                new()
                {
                    Title = "Colgate Total Active Ingredients and Safety",
                    Snippet = "Active Ingredient: Stannous Fluoride 0.454% (0.14% w/v fluoride ion). Inactive Ingredients: Water, Sorbitol, Hydrated Silica, Glycerin, PEG-12, Tetrasodium Pyrophosphate.",
                    Link = "https://www.colgate.com/products/colgate-total/ingredients"
                },
                new()
                {
                    Title = "Colgate Total Toothpaste Reviews | CVS",
                    Snippet = "Shop Colgate Total Toothpaste at CVS. Read customer reviews. 4.6/5 stars from 2,300+ reviews. ADA accepted for cavity prevention and gingivitis protection.",
                    Link = "https://www.cvs.com/colgate-total"
                }
            }
        },

        // Nutella
        ["80050965"] = new DemoProduct
        {
            Barcode = "80050965",
            Name = "Nutella Hazelnut Spread",
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = "Nutella Hazelnut Spread 400g | Ferrero",
                    Snippet = "Nutella is the original creamy, chocolatey hazelnut spread. Made with quality ingredients: cocoa, hazelnuts, and skim milk. Perfect for breakfast on bread, pancakes, or fruit.",
                    Link = "https://www.nutella.com/products/nutella-spread"
                },
                new()
                {
                    Title = "Nutella Nutrition Information and Ingredients",
                    Snippet = "Serving: 2 tbsp (37g). Calories: 200. Fat: 12g. Sugar: 21g. Ingredients: Sugar, Palm Oil, Hazelnuts (13%), Fat-Reduced Cocoa (7.4%), Skim Milk Powder (6.6%), Whey Powder, Lecithin, Vanillin.",
                    Link = "https://www.nutella.com/nutrition"
                },
                new()
                {
                    Title = "Nutella Recipes and Ideas | Pinterest",
                    Snippet = "Discover 1000+ Nutella recipes. From Nutella brownies to crepes, find inspiration for using your favorite hazelnut spread. Easy recipes for breakfast, dessert, and snacks.",
                    Link = "https://www.pinterest.com/nutella-recipes"
                }
            }
        }
    };

    public static List<string> BarcodeList => Products.Keys.ToList();

    /// <summary>
    /// Get demo product by barcode with fallback for unknown barcodes
    /// </summary>
    public static ProductLookupResponse GetDemoProduct(string barcode)
    {
        if (Products.TryGetValue(barcode, out var product))
        {
            return new ProductLookupResponse
            {
                Success = true,
                Barcode = barcode,
                Results = product.Results
            };
        }

        // Fallback for unknown barcodes
        return new ProductLookupResponse
        {
            Success = true,
            Barcode = barcode,
            Results = new List<SearchResult>
            {
                new()
                {
                    Title = $"Demo Product for Barcode {barcode}",
                    Snippet = $"This is a demo response for barcode {barcode}. In demo mode, product lookup returns mock data instead of making real API calls.",
                    Link = "https://example.com/demo-product"
                },
                new()
                {
                    Title = "Demo Mode Active - No Real API Calls",
                    Snippet = "The application is running in demo mode. This means no real Google Custom Search API calls are being made. Configure DEMO_MODE=false to use real API.",
                    Link = "https://example.com/demo-info"
                }
            }
        };
    }
}
