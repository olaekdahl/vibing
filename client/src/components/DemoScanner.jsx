import { useState, useEffect } from 'react';
import { demoProducts, getNextDemoProduct, getCurrentDemoProduct, resetDemoIndex } from '../demo/demoData';

/**
 * DemoScanner - A mock scanner component for demo mode
 * Simulates barcode scanning without requiring camera access
 */
const DemoScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(getCurrentDemoProduct());
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let progressInterval;
    let scanTimeout;

    if (isScanning) {
      // Simulate scanning progress
      setScanProgress(0);
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 10;
        });
      }, 150);

      // Simulate scan completion after progress reaches 100%
      scanTimeout = setTimeout(() => {
        setIsScanning(false);
        setScanProgress(0);
        if (onScanSuccess) {
          onScanSuccess(currentProduct.barcode);
        }
      }, 1800); // ~1.8 seconds for realistic scanning feel
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(scanTimeout);
    };
  }, [isScanning, currentProduct, onScanSuccess]);

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  const cycleToNextProduct = () => {
    const nextProduct = getNextDemoProduct();
    setCurrentProduct(nextProduct);
  };

  const selectProduct = (product) => {
    setCurrentProduct(product);
  };

  return (
    <div className="w-full">
      {/* Demo Mode Badge */}
      <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 font-semibold text-sm">🎭 DEMO MODE</span>
          <span className="text-amber-700 text-xs">No camera required - using mock data</span>
        </div>
      </div>

      {/* Product Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Demo Product:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {demoProducts.map((product, index) => (
            <button
              key={product.barcode}
              onClick={() => selectProduct(product)}
              className={`p-2 text-xs rounded-lg border transition-all duration-200 ${
                currentProduct.barcode === product.barcode
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold truncate">{product.name}</div>
              <div className="font-mono text-[10px] text-gray-500">{product.barcode}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scan Controls */}
      <div className="mb-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            🔍 Simulate Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Stop Scan
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={cycleToNextProduct}
          disabled={isScanning}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
        >
          Next Product →
        </button>
        <button
          onClick={() => {
            resetDemoIndex();
            setCurrentProduct(demoProducts[0]);
          }}
          disabled={isScanning}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
        >
          ↺ Reset
        </button>
      </div>

      {/* Simulated Scanner View */}
      {isScanning && (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          {/* Mock Camera View */}
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
            {/* Scanning Frame */}
            <div className="relative w-64 h-32 border-4 border-green-400 rounded-lg">
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-green-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-green-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-green-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-green-400"></div>
              
              {/* Scanning line animation */}
              <div 
                className="absolute left-0 right-0 h-0.5 bg-green-400 shadow-lg shadow-green-400/50 transition-all duration-150"
                style={{ top: `${scanProgress}%` }}
              ></div>

              {/* Barcode representation */}
              <div className="flex items-center justify-center h-full gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-12"
                    style={{ width: Math.random() > 0.5 ? '2px' : '4px' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-black bg-opacity-80 p-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-semibold">{currentProduct.name}</p>
                <p className="text-xs text-gray-400 font-mono">{currentProduct.barcode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-400">Scanning...</p>
                <p className="text-xs text-gray-400">{scanProgress}%</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Info (when not scanning) */}
      {!isScanning && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Ready to scan:</p>
          <p className="font-semibold text-gray-800">{currentProduct.name}</p>
          <p className="text-xs font-mono text-gray-500">{currentProduct.barcode}</p>
        </div>
      )}
    </div>
  );
};

export default DemoScanner;
