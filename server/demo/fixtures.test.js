/**
 * Tests for demo fixtures
 * Run with: node --test server/demo/fixtures.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  demoProducts, 
  demoBarcodeList, 
  getDemoProduct, 
  getRandomDemoProduct 
} from './fixtures.js';

describe('Demo Fixtures', () => {
  describe('demoProducts', () => {
    it('should contain at least 5 demo products', () => {
      assert.ok(Object.keys(demoProducts).length >= 5, 'Should have at least 5 products');
    });

    it('should have valid product structure for each product', () => {
      for (const [barcode, product] of Object.entries(demoProducts)) {
        assert.ok(product.barcode, `Product ${barcode} should have a barcode`);
        assert.ok(product.name, `Product ${barcode} should have a name`);
        assert.ok(Array.isArray(product.results), `Product ${barcode} should have results array`);
        assert.ok(product.results.length > 0, `Product ${barcode} should have at least one result`);
        
        // Check each result has required fields
        for (const result of product.results) {
          assert.ok(result.title, 'Result should have a title');
          assert.ok(result.snippet, 'Result should have a snippet');
          assert.ok(result.link, 'Result should have a link');
        }
      }
    });

    it('should have matching barcode in product object and key', () => {
      for (const [key, product] of Object.entries(demoProducts)) {
        assert.strictEqual(key, product.barcode, 'Key should match product.barcode');
      }
    });
  });

  describe('demoBarcodeList', () => {
    it('should contain all barcodes from demoProducts', () => {
      const productBarcodes = Object.keys(demoProducts);
      assert.deepStrictEqual(
        demoBarcodeList.sort(), 
        productBarcodes.sort(),
        'demoBarcodeList should contain all product barcodes'
      );
    });
  });

  describe('getDemoProduct', () => {
    it('should return product data for known barcode', () => {
      const barcode = demoBarcodeList[0];
      const result = getDemoProduct(barcode);
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.barcode, barcode);
      assert.ok(Array.isArray(result.results));
      assert.ok(result.results.length > 0);
    });

    it('should return fallback response for unknown barcode', () => {
      const result = getDemoProduct('UNKNOWN_BARCODE_12345');
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.barcode, 'UNKNOWN_BARCODE_12345');
      assert.ok(Array.isArray(result.results));
      assert.ok(result.results.length > 0);
      assert.ok(result.results[0].title.includes('Demo Product'));
    });

    it('should match Google API response schema', () => {
      const barcode = demoBarcodeList[0];
      const result = getDemoProduct(barcode);
      
      // Check top-level schema
      assert.ok('success' in result, 'Should have success field');
      assert.ok('barcode' in result, 'Should have barcode field');
      assert.ok('results' in result, 'Should have results field');
      
      // Check results item schema (matches Google Custom Search format)
      const firstResult = result.results[0];
      assert.ok('title' in firstResult, 'Result should have title');
      assert.ok('snippet' in firstResult, 'Result should have snippet');
      assert.ok('link' in firstResult, 'Result should have link');
    });
  });

  describe('getRandomDemoProduct', () => {
    it('should return a valid product', () => {
      const product = getRandomDemoProduct();
      
      assert.ok(product.barcode);
      assert.ok(product.name);
      assert.ok(Array.isArray(product.results));
    });

    it('should return product from the demo products list', () => {
      const product = getRandomDemoProduct();
      assert.ok(demoBarcodeList.includes(product.barcode));
    });
  });
});

console.log('Running demo fixtures tests...');
