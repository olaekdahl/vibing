# ProductScanner .NET Application

A web application to scan barcodes of food and cosmetic products, rewritten in .NET 9.0 with C#.

## Project Structure

```
dotnet/
├── ProductScanner.sln           # Solution file
├── src/
│   ├── ProductScanner.Api/      # ASP.NET Core Web API
│   │   ├── Models/              # Data models
│   │   ├── Services/            # Business logic
│   │   ├── Demo/                # Demo mode fixtures
│   │   └── Program.cs           # API entry point
│   └── ProductScanner.Web/      # Blazor WebAssembly frontend
│       ├── Components/          # Blazor components
│       ├── Models/              # Client-side models
│       ├── Services/            # API client services
│       └── Pages/               # Blazor pages
├── k8s/                         # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── deploy.sh
├── Dockerfile.api               # API container image
├── Dockerfile.web               # Web container image
├── docker-compose.yml           # Local Docker development
└── nginx.conf                   # Nginx config for web container
```

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker](https://www.docker.com/get-started) (for containerized deployment)
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (for Kubernetes deployment)

## Quick Start

### Run Locally (Development)

```bash
cd dotnet

# Run the API (in terminal 1)
cd src/ProductScanner.Api
dotnet run

# Run the Web frontend (in terminal 2)
cd src/ProductScanner.Web
dotnet run
```

- API: http://localhost:5000
- Web: http://localhost:5164 (or whatever port Blazor assigns)

### Run with Docker Compose

```bash
cd dotnet
docker-compose up --build
```

- API: http://localhost:5000
- Web: http://localhost:3000

## Demo Mode

Demo mode is enabled by default. This allows the application to run without:
- Camera access
- Google API credentials
- External API calls

### Available Demo Barcodes

| Product | Barcode |
|---------|---------|
| Coca-Cola Classic 330ml | `5449000000996` |
| Nivea Creme 150ml | `4005808134915` |
| Heinz Tomato Ketchup 397g | `0013000001090` |
| Dove Beauty Bar | `0011111181069` |
| Colgate Total Toothpaste | `0035000761095` |
| Nutella Hazelnut Spread 400g | `80050965` |

### Disable Demo Mode

Edit `src/ProductScanner.Api/appsettings.json`:

```json
{
  "DemoMode": false,
  "GoogleApi": {
    "ApiKey": "your_actual_api_key",
    "Cx": "your_search_engine_id",
    "ResultsLimit": 3
  }
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/demo/status` | Demo mode status |
| GET | `/api/lookup/{barcode}` | Product lookup |

## Kubernetes Deployment

### Quick Deploy

```bash
cd dotnet/k8s
./deploy.sh
```

### Manual Deploy

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy applications
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### Access in Kubernetes

```bash
# Port forward for local access
kubectl port-forward svc/productscanner-web-service 3000:80 -n productscanner
kubectl port-forward svc/productscanner-api-service 5000:5000 -n productscanner
```

Or add to `/etc/hosts`:
```
127.0.0.1 productscanner.local
```

Then visit: http://productscanner.local

### Kubernetes Resources

- **Deployments**: 2 replicas each for API and Web
- **Services**: ClusterIP services for internal communication
- **Ingress**: Nginx ingress for external access
- **HPA**: Horizontal Pod Autoscaler for auto-scaling
- **ConfigMaps**: Application configuration
- **Secrets**: API credentials (for production mode)

## Configuration

### Environment Variables (API)

| Variable | Description | Default |
|----------|-------------|---------|
| `DemoMode` | Enable demo mode | `true` |
| `GoogleApi__ApiKey` | Google API key | (empty) |
| `GoogleApi__Cx` | Google Custom Search Engine ID | (empty) |
| `GoogleApi__ResultsLimit` | Number of results to return | `3` |

### Client Configuration

Edit `src/ProductScanner.Web/wwwroot/appsettings.json`:

```json
{
  "ApiBaseAddress": "http://localhost:5000/"
}
```

## Building

```bash
cd dotnet

# Restore dependencies
dotnet restore

# Build all projects
dotnet build

# Run tests (if any)
dotnet test

# Publish for production
dotnet publish -c Release
```

## Docker Images

```bash
cd dotnet

# Build API image
docker build -f Dockerfile.api -t productscanner-api:latest .

# Build Web image
docker build -f Dockerfile.web -t productscanner-web:latest .
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Ingress                           │    │
│  │            productscanner.local                      │    │
│  └─────────────────┬───────────────────┬───────────────┘    │
│                    │                   │                     │
│         /api/*     │                   │ /*                  │
│                    ▼                   ▼                     │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │  API Service        │    │  Web Service            │    │
│  │  (ClusterIP:5000)   │    │  (ClusterIP:80)         │    │
│  └──────────┬──────────┘    └──────────┬──────────────┘    │
│             │                          │                     │
│             ▼                          ▼                     │
│  ┌─────────────────────┐    ┌─────────────────────────┐    │
│  │  API Deployment     │    │  Web Deployment         │    │
│  │  (2+ replicas)      │    │  (2+ replicas)          │    │
│  │  ASP.NET Core API   │    │  Blazor WASM + nginx    │    │
│  └─────────────────────┘    └─────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Backend**: ASP.NET Core 9.0, Minimal APIs
- **Frontend**: Blazor WebAssembly
- **Container Runtime**: Docker
- **Orchestration**: Kubernetes
- **Web Server**: nginx (for Blazor static files)

## License

ISC
