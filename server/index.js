import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { getDemoProduct, demoBarcodeList } from './demo/fixtures.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Demo mode configuration
const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    demoMode: DEMO_MODE
  });
});

// Demo status endpoint - returns demo mode state and available demo barcodes
app.get('/api/demo/status', (req, res) => {
  res.json({
    demoMode: DEMO_MODE,
    availableBarcodes: DEMO_MODE ? demoBarcodeList : [],
    message: DEMO_MODE 
      ? 'Demo mode is active. No real API calls will be made.' 
      : 'Demo mode is disabled. Real Google API calls will be made.'
  });
});

// Product lookup endpoint
app.get('/api/lookup/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    
    // Validate barcode
    if (!barcode || barcode.trim() === '') {
      return res.status(400).json({ 
        error: 'Invalid barcode',
        message: 'Barcode parameter is required' 
      });
    }

    // ============================================
    // DEMO MODE: Return mock data without API call
    // ============================================
    if (DEMO_MODE) {
      console.log(`[DEMO MODE] Looking up barcode: ${barcode}`);
      
      // Simulate network delay for realistic demo (300-800ms)
      const delay = Math.floor(Math.random() * 500) + 300;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const demoResult = getDemoProduct(barcode);
      console.log(`[DEMO MODE] Returning mock results for: ${barcode}`);
      
      return res.json(demoResult);
    }

    // ============================================
    // PRODUCTION MODE: Real Google API call
    // ============================================
    
    // Check if Google API credentials are configured
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_CX;
    const SEARCH_RESULTS_LIMIT = parseInt(process.env.SEARCH_RESULTS_LIMIT || '3', 10);

    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Google API credentials are not configured. Please set GOOGLE_API_KEY and GOOGLE_CX environment variables, or enable DEMO_MODE=true for testing.' 
      });
    }

    // Construct search query
    const searchQuery = `${barcode} food cosmetic product`;
    const googleSearchUrl = 'https://www.googleapis.com/customsearch/v1';

    // Make request to Google Custom Search API
    const response = await axios.get(googleSearchUrl, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CX,
        q: searchQuery,
        num: SEARCH_RESULTS_LIMIT // Get configurable number of results
      }
    });

    // Check if results exist
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No products found for this barcode',
        barcode: barcode
      });
    }

    // Format and return results
    const results = response.data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    }));

    res.json({
      success: true,
      barcode: barcode,
      results: results
    });

  } catch (error) {
    console.error('Error looking up product:', error);

    // Handle specific API errors
    if (error.response) {
      // Google API returned an error
      return res.status(error.response.status).json({
        error: 'Google API error',
        message: error.response.data.error?.message || 'Failed to search for product',
        details: error.response.data
      });
    }

    // Generic server error
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while looking up the product'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested endpoint does not exist' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Demo mode: ${DEMO_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Lookup endpoint: http://localhost:${PORT}/api/lookup/:barcode`);
  if (DEMO_MODE) {
    console.log(`Demo status: http://localhost:${PORT}/api/demo/status`);
    console.log(`Available demo barcodes: ${demoBarcodeList.join(', ')}`);
  }
});
