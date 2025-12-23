import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
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

    // Check if Google API credentials are configured
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_CX;

    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Google API credentials are not configured. Please set GOOGLE_API_KEY and GOOGLE_CX environment variables.' 
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
        num: 3 // Get top 3 results
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
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Lookup endpoint: http://localhost:${PORT}/api/lookup/:barcode`);
});
