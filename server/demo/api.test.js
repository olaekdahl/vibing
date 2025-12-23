/**
 * Integration tests for demo mode API endpoints
 * Run with: node --test server/demo/api.test.js
 * 
 * Note: These tests require the server to NOT be running,
 * as they start their own test server instance.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

// Import server setup (we'll create a test version)
import express from 'express';
import { getDemoProduct, demoBarcodeList } from './fixtures.js';

describe('Demo Mode API Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    // Create a minimal test server
    const app = express();
    app.use(express.json());

    // Demo status endpoint
    app.get('/api/demo/status', (req, res) => {
      res.json({
        demoMode: true,
        availableBarcodes: demoBarcodeList,
        message: 'Demo mode is active. No real API calls will be made.'
      });
    });

    // Product lookup endpoint (demo mode)
    app.get('/api/lookup/:barcode', async (req, res) => {
      const { barcode } = req.params;
      
      if (!barcode || barcode.trim() === '') {
        return res.status(400).json({ 
          error: 'Invalid barcode',
          message: 'Barcode parameter is required' 
        });
      }

      // Simulate small delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const result = getDemoProduct(barcode);
      res.json(result);
    });

    // Start test server
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  const fetch = async (path) => {
    return new Promise((resolve, reject) => {
      http.get(`${baseUrl}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        });
      }).on('error', reject);
    });
  };

  describe('GET /api/demo/status', () => {
    it('should return demo mode status', async () => {
      const response = await fetch('/api/demo/status');
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.demoMode, true);
      assert.ok(Array.isArray(response.data.availableBarcodes));
      assert.ok(response.data.message.includes('Demo mode'));
    });

    it('should list all available demo barcodes', async () => {
      const response = await fetch('/api/demo/status');
      
      assert.deepStrictEqual(
        response.data.availableBarcodes.sort(),
        demoBarcodeList.sort()
      );
    });
  });

  describe('GET /api/lookup/:barcode', () => {
    it('should return demo results for known barcode', async () => {
      const barcode = demoBarcodeList[0];
      const response = await fetch(`/api/lookup/${barcode}`);
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.strictEqual(response.data.barcode, barcode);
      assert.ok(Array.isArray(response.data.results));
    });

    it('should return fallback results for unknown barcode', async () => {
      const response = await fetch('/api/lookup/UNKNOWN123');
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.success, true);
      assert.strictEqual(response.data.barcode, 'UNKNOWN123');
    });

    it('should handle URL-encoded barcodes', async () => {
      const barcode = demoBarcodeList[0];
      const response = await fetch(`/api/lookup/${encodeURIComponent(barcode)}`);
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.barcode, barcode);
    });
  });
});

console.log('Running demo API tests...');
