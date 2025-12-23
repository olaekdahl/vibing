import { useState } from 'react';
import axios from 'axios';
import Scanner from './components/Scanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [manualBarcode, setManualBarcode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState('');

  const lookupBarcode = async (barcode) => {
    if (!barcode || barcode.trim() === '') {
      setError('Please enter a valid barcode');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setLastScannedBarcode(barcode);

    try {
      const response = await axios.get(`${API_URL}/api/lookup/${encodeURIComponent(barcode)}`);
      setResults(response.data);
    } catch (err) {
      console.error('Lookup error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Failed to lookup product');
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        // Something else happened
        setError('An error occurred while looking up the product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (barcode) => {
    lookupBarcode(barcode);
  };

  const handleScanError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    lookupBarcode(manualBarcode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ProductScanner</h1>
          <p className="text-gray-600">Scan barcodes to find product information</p>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Barcode Scanner</h2>
          <Scanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
        </div>

        {/* Manual Entry Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manual Entry</h2>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode number..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for product information...</p>
          </div>
        )}

        {/* Error Display */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && !loading && results.success && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Search Results</h2>
              <p className="text-sm text-gray-600">
                Barcode: <span className="font-mono font-semibold">{results.barcode}</span>
              </p>
            </div>

            <div className="space-y-4">
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {result.title}
                    </a>
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">{result.snippet}</p>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline break-all"
                  >
                    {result.link}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {results && !loading && !results.success && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Results Found</h3>
            <p className="text-yellow-700">
              No products found for barcode: <span className="font-mono">{lastScannedBarcode}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

