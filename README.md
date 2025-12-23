# ProductScanner

A web application to scan barcodes of food and cosmetic products and look them up using Google Custom Search API.

## Features

- 📷 Real-time barcode scanning using device camera
- ⌨️ Manual barcode entry option
- 🔍 Google Custom Search integration
- 📱 Mobile-responsive design
- ✨ Clean, modern UI with Tailwind CSS
- 🎭 **Demo Mode** - Full functionality without camera or API credentials

## Demo Mode

Demo mode allows you to demonstrate the application without requiring:
- Camera access
- Google API credentials
- Internet connectivity (for search results)

### Enabling Demo Mode

**Quick Start (Recommended):**

1. Copy the demo environment files:
   ```bash
   # Server
   cp server/.env.demo server/.env
   
   # Client
   cp client/.env.demo client/.env
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

**Manual Configuration:**

Set the following environment variables:

| Location | Variable | Value | Description |
|----------|----------|-------|-------------|
| `server/.env` | `DEMO_MODE` | `true` | Enables mock API responses |
| `client/.env` | `VITE_DEMO_MODE` | `true` | Enables mock scanner UI |

### Demo Mode Features

- **Mock Scanner**: Simulated barcode scanner with selectable products
- **Sample Products**: 6 pre-configured products with realistic data
- **Simulated Delays**: Network latency simulation for realistic UX
- **Visual Indicators**: Clear "Demo Mode" badges throughout the UI

### Available Demo Products

| Product | Barcode |
|---------|---------|
| Coca-Cola Classic 330ml | `5449000000996` |
| Nivea Creme 150ml | `4005808134915` |
| Heinz Tomato Ketchup 397g | `0013000001090` |
| Dove Beauty Bar | `0011111181069` |
| Colgate Total Toothpaste | `0035000761095` |
| Nutella Hazelnut Spread 400g | `80050965` |

### Switching Between Demo and Production Mode

**To enable demo mode:**
```bash
# Server
echo "DEMO_MODE=true" >> server/.env

# Client  
echo "VITE_DEMO_MODE=true" >> client/.env
```

**To disable demo mode (use real camera/API):**
```bash
# Server - set DEMO_MODE=false and configure Google API credentials
cp server/.env.production server/.env
# Edit server/.env with your actual GOOGLE_API_KEY and GOOGLE_CX

# Client - set VITE_DEMO_MODE=false
cp client/.env.production client/.env
```

### Demo Mode API Endpoint

Check demo status programmatically:
```bash
GET /api/demo/status

# Response:
{
  "demoMode": true,
  "availableBarcodes": ["5449000000996", "4005808134915", ...],
  "message": "Demo mode is active. No real API calls will be made."
}
```

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- html5-qrcode for barcode scanning
- Axios for API calls

### Backend
- Node.js
- Express
- Google Custom Search JSON API
- dotenv for environment variables

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Google Cloud account for API credentials

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd vibing
```

### 2. Install dependencies

Install all dependencies for root, client, and server:

```bash
npm run install:all
```

Or install manually:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Set up Google Custom Search API

#### Step 1: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Custom Search API":
   - Navigate to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

#### Step 2: Get Custom Search Engine ID (CX)

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" or "Create a new search engine"
3. Configure your search engine:
   - **Sites to search**: Enter `www.google.com/*` or specific domains you want to search
   - **Name**: Give it a descriptive name (e.g., "Product Search")
   - Click "Create"
4. In the search engine settings:
   - Turn ON "Search the entire web"
   - Copy your "Search engine ID" (CX parameter)

#### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your credentials:

```env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CX=your_custom_search_engine_id_here
PORT=5000
```

(Optional) Create a `.env` file in the `client` directory:

```bash
cd ../client
cp .env.example .env
```

Edit if you need to change the API URL (default is `http://localhost:5000`):

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode (Recommended)

Run both client and server concurrently from the root directory:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

### Running Separately

#### Start the backend server:

```bash
npm run server
# or
cd server && npm run dev
```

#### Start the frontend:

```bash
npm run client
# or
cd client && npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Start Scan" to activate your camera
3. Point your camera at a product barcode (EAN-13, UPC, etc.)
4. The app will automatically detect the barcode and search for product information
5. Alternatively, use the "Manual Entry" field to type in a barcode number

### Supported Barcode Formats

- EAN-13
- EAN-8
- UPC-A
- UPC-E
- CODE-128
- CODE-39

## Project Structure

```
vibing/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scanner.jsx     # Real barcode scanner component
│   │   │   └── DemoScanner.jsx # Mock scanner for demo mode
│   │   ├── demo/
│   │   │   └── demoData.js     # Client-side demo product data
│   │   ├── App.jsx             # Main application component
│   │   ├── index.css           # Global styles with Tailwind
│   │   └── main.jsx            # Application entry point
│   ├── .env.example            # Environment template
│   ├── .env.demo               # Demo mode preset
│   ├── .env.production         # Production mode preset
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── demo/
│   │   ├── fixtures.js         # Mock product data
│   │   ├── fixtures.test.js    # Fixtures unit tests
│   │   └── api.test.js         # API integration tests
│   ├── index.js               # Server and API endpoints
│   ├── .env.example           # Environment template
│   ├── .env.demo              # Demo mode preset
│   ├── .env.production        # Production mode preset
│   └── package.json
├── package.json          # Root package.json with scripts
└── README.md
```

## API Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "demoMode": true
}
```

### GET /api/demo/status

Get demo mode status and available demo barcodes.

**Response:**
```json
{
  "demoMode": true,
  "availableBarcodes": ["5449000000996", "4005808134915", ...],
  "message": "Demo mode is active. No real API calls will be made."
}
```

### GET /api/lookup/:barcode

Look up product information by barcode.

**Parameters:**
- `barcode` (path parameter): The barcode number to search for

**Response (Success):**
```json
{
  "success": true,
  "barcode": "1234567890123",
  "results": [
    {
      "title": "Product Title",
      "snippet": "Product description...",
      "link": "https://example.com/product"
    }
  ]
}
```

**Response (Error):**
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

## Troubleshooting

### Camera Permission Denied

If you get a camera permission error:
1. Check browser settings and allow camera access for the site
2. Ensure you're using HTTPS (or localhost for development)
3. Try using the Manual Entry option instead

### No Results Found

If searches return no results:
1. Verify your Google API credentials are correct
2. Check that the Custom Search Engine is configured to search the entire web
3. Ensure the barcode number is valid

### Server Connection Error

If the frontend can't connect to the backend:
1. Make sure the backend server is running on port 5000
2. Check that the `VITE_API_URL` in client/.env matches your backend URL
3. Verify there are no firewall or network issues

## Building for Production

### Build the frontend:

```bash
cd client
npm run build
```

The built files will be in `client/dist/`.

### Running Tests

```bash
# Run all server tests
cd server
npm test

# Run specific tests
npm run test:fixtures  # Test demo fixtures
npm run test:api       # Test API endpoints
```

### Deploy:

1. Deploy the backend to your preferred hosting service (Heroku, Railway, etc.)
2. Update environment variables on the hosting platform
3. Deploy the frontend to a static hosting service (Vercel, Netlify, etc.)
4. Update `VITE_API_URL` to point to your production backend URL

## License

ISC

## Contributing

Feel free to submit issues and pull requests!
