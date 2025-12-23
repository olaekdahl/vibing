# ProductScanner

A web application to scan barcodes of food and cosmetic products and look them up using Google Custom Search API.

## Features

- 📷 Real-time barcode scanning using device camera
- ⌨️ Manual barcode entry option
- 🔍 Google Custom Search integration
- 📱 Mobile-responsive design
- ✨ Clean, modern UI with Tailwind CSS

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
│   │   │   └── Scanner.jsx # Barcode scanner component
│   │   ├── App.jsx        # Main application component
│   │   ├── index.css      # Global styles with Tailwind
│   │   └── main.jsx       # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── index.js          # Server and API endpoints
│   ├── package.json
│   └── .env.example
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
  "message": "Server is running"
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

### Deploy:

1. Deploy the backend to your preferred hosting service (Heroku, Railway, etc.)
2. Update environment variables on the hosting platform
3. Deploy the frontend to a static hosting service (Vercel, Netlify, etc.)
4. Update `VITE_API_URL` to point to your production backend URL

## License

ISC

## Contributing

Feel free to submit issues and pull requests!
